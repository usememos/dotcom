import type { ScratchpadAttachmentRef, ScratchpadCardTone, ScratchpadItem, ScratchpadItemLayout } from "../types";
import type { SyncBackend } from "./backend";
import { uploadMissingBlobs } from "./blobs";
import { advanceClock, type Clock, createClock, receiveClock } from "./clock";
import { applyMutationToCard, coalesceOutbox } from "./mutations";
import { reconcileCard } from "./reconcile";
import { ackOutbox, commitLocalMutation, getMeta, getStoredCard, putStoredCard, readOutbox, setMeta } from "./store";
import { type Mutation, type MutationDraft, type PullResponse, type PushResponse, SCRATCHPAD_FIELD_GROUPS, type StoredCard } from "./types";

const META_CLOCK = "syncClock";
const META_CURSOR = "syncCursor";
const META_LAST_SYNC = "lastSyncAt";

export type RecordMutationInput =
  | { cardId: string; field: "create"; value: ScratchpadItem }
  | { cardId: string; field: "body"; value: string }
  | { cardId: string; field: "layout"; value: ScratchpadItemLayout }
  | { cardId: string; field: "tone"; value: ScratchpadCardTone }
  | { cardId: string; field: "attachments"; value: ScratchpadAttachmentRef[] }
  | { cardId: string; field: "delete"; value: null };

export interface SyncEngineOptions {
  backend: SyncBackend;
  deviceId: string;
  onCardsChanged?: (cards: StoredCard[]) => void;
  now?: () => number;
  debounceMs?: number;
}

export interface SyncEngine {
  start(): Promise<void>;
  stop(): void;
  recordMutation(input: RecordMutationInput): Promise<number>;
  requestSync(): void;
  syncNow(): Promise<void>;
}

export function createSyncEngine(options: SyncEngineOptions): SyncEngine {
  const { backend, deviceId } = options;
  const now = options.now ?? (() => Date.now());
  const debounceMs = options.debounceMs ?? 1000;
  const onCardsChanged = options.onCardsChanged ?? (() => {});

  let clock = createClock(deviceId);
  let cursor: string | null = null;
  let started = false;
  let running = false;
  let rerun = false;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let backoffMs = 1000;

  const persistClock = () => {
    void setMeta(META_CLOCK, clock);
  };

  const nextClock = (): Clock => {
    clock = advanceClock(clock, now());
    persistClock();
    return clock;
  };

  const bumpClockPast = (remote: StoredCard) => {
    for (const g of SCRATCHPAD_FIELD_GROUPS) clock = receiveClock(clock, remote.clocks[g], now());
    if (remote.deletedClock) clock = receiveClock(clock, remote.deletedClock, now());
    persistClock();
  };

  async function recordMutation(input: RecordMutationInput): Promise<number> {
    const draft: MutationDraft = { cardId: input.cardId, field: input.field, value: input.value, clock: nextClock() } as MutationDraft;
    const local = await getStoredCard(input.cardId);
    // Bail if the engine was stopped while the read was in flight: writing now
    // would persist after teardown (and, in tests, into the next case's store).
    if (!started) return -1;
    const applied = applyMutationToCard(local, { ...draft, seq: 0 } as Mutation);
    if (!applied) return -1;
    const seq = await commitLocalMutation({ ...applied, dirty: true }, draft);
    requestSync();
    return seq;
  }

  async function mergeChanges(changes: StoredCard[]): Promise<void> {
    if (changes.length === 0) return;
    const pendingAll = coalesceOutbox(await readOutbox());
    const merged: StoredCard[] = [];
    for (const remote of changes) {
      bumpClockPast(remote);
      const local = await getStoredCard(remote.id);
      const pending = pendingAll.filter((m) => m.cardId === remote.id);
      const result = reconcileCard({ local, remote, pending });
      await putStoredCard(result);
      merged.push(result);
    }
    onCardsChanged(merged);
  }

  async function runCycle(): Promise<void> {
    const raw = await readOutbox();
    const coalesced = coalesceOutbox(raw);
    let response: PushResponse | PullResponse;
    if (coalesced.length > 0) {
      // Only upload blobs referenced by the cards we are actually pushing, not
      // every card in the store.
      const cardIds = [...new Set(coalesced.map((m) => m.cardId))];
      const pushedCards = (await Promise.all(cardIds.map((id) => getStoredCard(id)))).filter((c): c is StoredCard => c !== null);
      await uploadMissingBlobs(
        backend,
        pushedCards.flatMap((c) => c.content.attachments),
      );
      response = await backend.push({ mutations: coalesced, cursor });
      // Ack every raw outbox seq we read — including entries that coalescing
      // dropped — so superseded edits are cleared. A real backend that only
      // partially applies should return its applied set in `response.acked`;
      // honoring that (while still clearing coalesced-away seqs) is a
      // backend-phase task. The mock accepts everything, so acking all is correct.
      await ackOutbox(raw.map((m) => m.seq));
    } else {
      response = await backend.pull({ cursor });
    }
    await mergeChanges(response.changes);
    cursor = response.cursor;
    await setMeta(META_CURSOR, cursor);
    await setMeta(META_LAST_SYNC, now());
  }

  function scheduleRetry(): void {
    const delay = backoffMs;
    backoffMs = Math.min(backoffMs * 2, 30000);
    retryTimer = setTimeout(() => {
      retryTimer = null;
      void syncNow();
    }, delay);
  }

  async function syncNow(): Promise<void> {
    if (!started) return;
    if (running) {
      rerun = true;
      return;
    }
    running = true;
    try {
      do {
        rerun = false;
        await runCycle();
        backoffMs = 1000;
      } while (rerun);
    } catch {
      scheduleRetry();
    } finally {
      running = false;
    }
  }

  function requestSync(): void {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      void syncNow();
    }, debounceMs);
  }

  const handleWake = () => requestSync();
  const handleVisible = () => {
    if (typeof document !== "undefined" && document.visibilityState === "visible") requestSync();
  };

  async function start(): Promise<void> {
    if (started) return;
    const savedClock = await getMeta<Clock>(META_CLOCK);
    if (savedClock) clock = { ...savedClock, deviceId };
    cursor = await getMeta<string>(META_CURSOR);
    started = true;
    if (typeof window !== "undefined") {
      window.addEventListener("focus", handleWake);
      window.addEventListener("online", handleWake);
      document.addEventListener("visibilitychange", handleVisible);
    }
    // start() only wires things up; it does not sync. The consumer triggers the
    // initial pull-on-load via requestSync(), and edits/focus drive the rest.
    // Keeping start() side-effect-free here avoids a sync landing between an
    // optimistic edit's reducer dispatch and its store commit.
  }

  function stop(): void {
    started = false;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (retryTimer) clearTimeout(retryTimer);
    debounceTimer = null;
    retryTimer = null;
    if (typeof window !== "undefined") {
      window.removeEventListener("focus", handleWake);
      window.removeEventListener("online", handleWake);
      document.removeEventListener("visibilitychange", handleVisible);
    }
  }

  return { start, stop, recordMutation, requestSync, syncNow };
}

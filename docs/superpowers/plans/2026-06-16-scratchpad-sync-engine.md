# Scratchpad Sync Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the scratchpad local-first on a unified IndexedDB store with a Linear-style, single-user/multi-device sync engine (field-level LWW), wired to a typed `SyncBackend` port whose only implementation today is an in-memory mock.

**Architecture:** Every user action becomes a field-group patch (`Mutation`) stamped with a hybrid logical clock, applied optimistically to a durable IndexedDB `cards` store and appended to an `outbox` in one transaction. A single-flight sync loop coalesces the outbox, pushes/pulls deltas through the `SyncBackend` port, and merges incoming cards field-by-field (pending local edits always win until acked). Attachment bytes sync on a separate content-addressed path. The existing `useReducer` stays as the in-memory view; the engine writes the store and notifies the hook over a `BroadcastChannel`.

**Tech Stack:** TypeScript, React 19, Next.js 16, IndexedDB (via `fake-indexeddb` in tests), WebCrypto (`crypto.subtle`), Vitest, Biome.

**Spec:** `docs/superpowers/specs/2026-06-16-scratchpad-sync-engine-design.md`

**Plan-level decisions (refinements of the spec, called out here):**
- Deletion uses its own `deletedClock` LWW register on the card (instead of the spec's `syncedClock`); a card is "deleted" when `deletedClock` is the newest stamp on it. This makes delete/edit races resolve by the same LWW rule as any field and lets a later edit resurrect a card (add-wins) — fine for one user.
- `dirty` (boolean) + the outbox subsume the spec's per-card `syncedClock` high-water mark. A card is fully synced when it has no pending outbox entries.
- Multi-device **convergence** is tested at the mock-backend + `reconcileCard` layer (a tiny in-test client), not with two live IndexedDB stores, because `fake-indexeddb` exposes one global instance per test. The engine's own test covers single-device wiring against the real store.
- Viewport relocates into the `meta` store per the spec; the old `localStorage` viewport is migrated once.

---

## File Structure

```
src/features/scratchpad/
  types.ts                         MODIFY: add `hash?: string` to ScratchpadAttachmentRef
  lib/
    editor.ts                      MODIFY: add `merge-cards` reducer action
    indexeddb.ts                   MODIFY: open the unified DB (v2) instead of its own v1
  hooks/
    use-scratchpad-editor.ts       MODIFY: deviceId, migration, engine, recordMutation, BroadcastChannel, viewport→meta
  sync/                            NEW
    clock.ts                       Hybrid logical clock (pure)
    types.ts                       StoredCard, Mutation union, field groups, push/pull DTOs
    mutations.ts                   apply/coalesce/LWW helpers (pure)
    reconcile.ts                   field-by-field LWW merge (pure)
    store.ts                       IndexedDB: cards / outbox / meta (+ unified DB opener)
    blobs.ts                       content-addressed blob store + SHA-256 + lazy download
    backend.ts                     SyncBackend interface + DTO re-exports
    backend-mock.ts                in-memory SyncBackend
    backend-contract.test.ts       reusable contract suite (run against the mock now)
    convergence.test.ts            two-device merge simulation
    device.ts                      stable per-device id
    migration.ts                   one-time localStorage→IndexedDB + blob re-key
    engine.ts                      createSyncEngine: loop, triggers, single-flight, recordMutation
```

Dependency direction (no cycles): `clock` ← `types` ← `mutations` ← `reconcile`; `store`/`blobs`/`backend-mock`/`engine` depend on the pure layer.

---

## Task 1: Hybrid logical clock

**Files:**
- Create: `src/features/scratchpad/sync/clock.ts`
- Test: `src/features/scratchpad/sync/clock.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/sync/clock.test.ts
import { describe, expect, it } from "vitest";
import { advanceClock, type Clock, compareClocks, createClock, receiveClock } from "./clock";

const c = (ts: number, counter: number, deviceId: string): Clock => ({ ts, counter, deviceId });

describe("compareClocks", () => {
  it("orders by ts, then counter, then deviceId", () => {
    expect(compareClocks(c(1, 0, "a"), c(2, 0, "a"))).toBe(-1);
    expect(compareClocks(c(2, 0, "a"), c(2, 1, "a"))).toBe(-1);
    expect(compareClocks(c(2, 1, "a"), c(2, 1, "b"))).toBe(-1);
    expect(compareClocks(c(2, 1, "b"), c(2, 1, "b"))).toBe(0);
  });
});

describe("advanceClock", () => {
  it("bumps counter when wall time has not moved", () => {
    const start = createClock("a");
    const first = advanceClock(start, 100);
    const second = advanceClock(first, 100);
    expect(first).toEqual(c(100, 0, "a"));
    expect(second).toEqual(c(100, 1, "a"));
  });

  it("resets counter and tracks wall time when it moves forward", () => {
    const next = advanceClock(c(100, 5, "a"), 200);
    expect(next).toEqual(c(200, 0, "a"));
  });

  it("never goes backwards if the wall clock is behind", () => {
    const next = advanceClock(c(300, 0, "a"), 200);
    expect(next).toEqual(c(300, 1, "a"));
  });
});

describe("receiveClock", () => {
  it("jumps past a remote clock from the future", () => {
    const merged = receiveClock(c(100, 0, "a"), c(500, 3, "b"), 100);
    expect(merged.ts).toBe(500);
    expect(merged.counter).toBe(4);
    expect(merged.deviceId).toBe("a");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/clock.test.ts`
Expected: FAIL — cannot find module `./clock`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/scratchpad/sync/clock.ts
export interface Clock {
  ts: number;
  counter: number;
  deviceId: string;
}

export function createClock(deviceId: string, ts = 0, counter = 0): Clock {
  return { ts, counter, deviceId };
}

export function compareClocks(a: Clock, b: Clock): number {
  if (a.ts !== b.ts) return a.ts < b.ts ? -1 : 1;
  if (a.counter !== b.counter) return a.counter < b.counter ? -1 : 1;
  if (a.deviceId !== b.deviceId) return a.deviceId < b.deviceId ? -1 : 1;
  return 0;
}

export function advanceClock(prev: Clock, now: number): Clock {
  const ts = Math.max(prev.ts, now);
  const counter = ts === prev.ts ? prev.counter + 1 : 0;
  return { ts, counter, deviceId: prev.deviceId };
}

export function receiveClock(local: Clock, remote: Clock, now: number): Clock {
  const ts = Math.max(local.ts, remote.ts, now);
  let counter: number;
  if (ts === local.ts && ts === remote.ts) counter = Math.max(local.counter, remote.counter) + 1;
  else if (ts === local.ts) counter = local.counter + 1;
  else if (ts === remote.ts) counter = remote.counter + 1;
  else counter = 0;
  return { ts, counter, deviceId: local.deviceId };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/clock.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/clock.ts src/features/scratchpad/sync/clock.test.ts
git add src/features/scratchpad/sync/clock.ts src/features/scratchpad/sync/clock.test.ts
git commit -m "feat(scratchpad): add hybrid logical clock for sync"
```

---

## Task 2: Shared sync types

**Files:**
- Create: `src/features/scratchpad/sync/types.ts`
- Modify: `src/features/scratchpad/types.ts` (add `hash?` to `ScratchpadAttachmentRef`)

> No standalone test: this file is pure type/const declarations. It is exercised by every later task's tests. The one runtime export (`SCRATCHPAD_FIELD_GROUPS`) is covered by Task 3.

- [ ] **Step 1: Add `hash` to the attachment ref**

In `src/features/scratchpad/types.ts`, change:

```ts
export interface ScratchpadAttachmentRef {
  id: string; // IndexedDB key
  name: string;
  type: string; // MIME type
  size: number;
}
```

to:

```ts
export interface ScratchpadAttachmentRef {
  id: string; // IndexedDB key
  name: string;
  type: string; // MIME type
  size: number;
  hash?: string; // SHA-256 content hash for content-addressed blob sync
}
```

- [ ] **Step 2: Create the sync types**

```ts
// src/features/scratchpad/sync/types.ts
import type { Clock } from "./clock";
import type { ScratchpadAttachmentRef, ScratchpadCardTone, ScratchpadItem, ScratchpadItemLayout } from "../types";

export type ScratchpadFieldGroup = "body" | "layout" | "tone" | "attachments";

export const SCRATCHPAD_FIELD_GROUPS: ScratchpadFieldGroup[] = ["body", "layout", "tone", "attachments"];

/** A card plus its sync metadata. Persisted in the `cards` store. */
export interface StoredCard extends ScratchpadItem {
  clocks: Record<ScratchpadFieldGroup, Clock>;
  deletedAt: number | null;
  deletedClock: Clock | null;
  dirty: boolean;
}

export type Mutation =
  | { seq: number; cardId: string; clock: Clock; field: "create"; value: ScratchpadItem }
  | { seq: number; cardId: string; clock: Clock; field: "body"; value: string }
  | { seq: number; cardId: string; clock: Clock; field: "layout"; value: ScratchpadItemLayout }
  | { seq: number; cardId: string; clock: Clock; field: "tone"; value: ScratchpadCardTone }
  | { seq: number; cardId: string; clock: Clock; field: "attachments"; value: ScratchpadAttachmentRef[] }
  | { seq: number; cardId: string; clock: Clock; field: "delete"; value: null };

export type MutationDraft = Omit<Mutation, "seq">;

export interface PushRequest {
  mutations: Mutation[];
  cursor: string | null;
}
export interface PushResponse {
  acked: number[];
  changes: StoredCard[];
  cursor: string;
}
export interface PullRequest {
  cursor: string | null;
}
export interface PullResponse {
  changes: StoredCard[];
  cursor: string;
}
```

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (no errors).

- [ ] **Step 4: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/types.ts src/features/scratchpad/types.ts
git add src/features/scratchpad/sync/types.ts src/features/scratchpad/types.ts
git commit -m "feat(scratchpad): add sync types and attachment content hash"
```

---

## Task 3: Mutation helpers (apply, LWW gate, coalesce)

**Files:**
- Create: `src/features/scratchpad/sync/mutations.ts`
- Test: `src/features/scratchpad/sync/mutations.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/sync/mutations.test.ts
import { describe, expect, it } from "vitest";
import type { Clock } from "./clock";
import { applyMutationToCard, coalesceOutbox, createStoredCard, maxFieldClock, mutationWins } from "./mutations";
import type { Mutation, StoredCard } from "./types";
import type { ScratchpadItem } from "../types";

const clk = (ts: number, deviceId = "a", counter = 0): Clock => ({ ts, counter, deviceId });

const item = (id: string): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

const mut = (over: Partial<Mutation> & Pick<Mutation, "field" | "value">): Mutation =>
  ({ seq: 1, cardId: "x", clock: clk(1), ...over }) as Mutation;

describe("createStoredCard", () => {
  it("stamps every field group with the create clock and marks dirty", () => {
    const card = createStoredCard(item("x"), clk(5));
    expect(card.clocks.body).toEqual(clk(5));
    expect(card.clocks.layout).toEqual(clk(5));
    expect(card.dirty).toBe(true);
    expect(card.deletedClock).toBeNull();
  });
});

describe("applyMutationToCard", () => {
  it("creates a card from a create mutation", () => {
    const card = applyMutationToCard(null, mut({ field: "create", value: item("x"), clock: clk(2) }));
    expect(card?.id).toBe("x");
  });

  it("updates the body and its clock", () => {
    const base = createStoredCard(item("x"), clk(1));
    const next = applyMutationToCard(base, mut({ field: "body", value: "hi", clock: clk(9) }));
    expect(next?.content.body).toBe("hi");
    expect(next?.clocks.body).toEqual(clk(9));
  });

  it("sets a tombstone on delete", () => {
    const base = createStoredCard(item("x"), clk(1));
    const next = applyMutationToCard(base, mut({ field: "delete", value: null, clock: clk(9) }));
    expect(next?.deletedClock).toEqual(clk(9));
    expect(next?.deletedAt).toBe(9);
  });
});

describe("mutationWins", () => {
  it("rejects a body patch with an older clock", () => {
    const base = createStoredCard(item("x"), clk(10));
    expect(mutationWins(base, mut({ field: "body", value: "z", clock: clk(5) }))).toBe(false);
    expect(mutationWins(base, mut({ field: "body", value: "z", clock: clk(20) }))).toBe(true);
  });

  it("accepts a create only when the card is absent", () => {
    expect(mutationWins(null, mut({ field: "create", value: item("x") }))).toBe(true);
    expect(mutationWins(createStoredCard(item("x"), clk(1)), mut({ field: "create", value: item("x") }))).toBe(false);
  });
});

describe("maxFieldClock", () => {
  it("returns the newest field clock", () => {
    const card: StoredCard = { ...createStoredCard(item("x"), clk(1)), clocks: { body: clk(1), layout: clk(7), tone: clk(3), attachments: clk(2) } };
    expect(maxFieldClock(card)).toEqual(clk(7));
  });
});

describe("coalesceOutbox", () => {
  it("keeps only the latest mutation per card+field, sorted by seq", () => {
    const result = coalesceOutbox([
      mut({ seq: 1, cardId: "x", field: "body", value: "a" }),
      mut({ seq: 2, cardId: "x", field: "body", value: "b" }),
      mut({ seq: 3, cardId: "x", field: "layout", value: item("x").layout }),
    ]);
    expect(result.map((m) => m.seq)).toEqual([2, 3]);
    expect(result.find((m) => m.field === "body")?.value).toBe("b");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/mutations.test.ts`
Expected: FAIL — cannot find module `./mutations`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/scratchpad/sync/mutations.ts
import { type Clock, compareClocks } from "./clock";
import { SCRATCHPAD_FIELD_GROUPS, type Mutation, type StoredCard } from "./types";
import type { ScratchpadItem } from "../types";

export function createStoredCard(item: ScratchpadItem, clock: Clock): StoredCard {
  return {
    ...item,
    clocks: { body: clock, layout: clock, tone: clock, attachments: clock },
    deletedAt: null,
    deletedClock: null,
    dirty: true,
  };
}

export function maxFieldClock(card: StoredCard): Clock {
  return SCRATCHPAD_FIELD_GROUPS.reduce<Clock>(
    (max, g) => (compareClocks(card.clocks[g], max) > 0 ? card.clocks[g] : max),
    card.clocks.body,
  );
}

export function applyMutationToCard(card: StoredCard | null, mutation: Mutation): StoredCard | null {
  if (mutation.field === "create") {
    return card ?? createStoredCard(mutation.value, mutation.clock);
  }
  if (!card) return card;
  switch (mutation.field) {
    case "body":
      return { ...card, content: { ...card.content, body: mutation.value }, clocks: { ...card.clocks, body: mutation.clock } };
    case "layout":
      return { ...card, layout: mutation.value, clocks: { ...card.clocks, layout: mutation.clock } };
    case "tone":
      return { ...card, tone: mutation.value, clocks: { ...card.clocks, tone: mutation.clock } };
    case "attachments":
      return { ...card, content: { ...card.content, attachments: mutation.value }, clocks: { ...card.clocks, attachments: mutation.clock } };
    case "delete":
      return { ...card, deletedAt: mutation.clock.ts, deletedClock: mutation.clock };
  }
}

export function mutationWins(card: StoredCard | null, mutation: Mutation): boolean {
  if (mutation.field === "create") return !card;
  if (!card) return false;
  if (mutation.field === "delete") {
    const against = card.deletedClock ?? maxFieldClock(card);
    return compareClocks(mutation.clock, against) > 0;
  }
  return compareClocks(mutation.clock, card.clocks[mutation.field]) > 0;
}

export function coalesceOutbox(mutations: Mutation[]): Mutation[] {
  const latest = new Map<string, Mutation>();
  for (const m of mutations) {
    const key = `${m.cardId}::${m.field}`;
    const existing = latest.get(key);
    if (!existing || m.seq > existing.seq) latest.set(key, m);
  }
  return Array.from(latest.values()).sort((a, b) => a.seq - b.seq);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/mutations.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/mutations.ts src/features/scratchpad/sync/mutations.test.ts
git add src/features/scratchpad/sync/mutations.ts src/features/scratchpad/sync/mutations.test.ts
git commit -m "feat(scratchpad): add mutation apply/coalesce/LWW helpers"
```

---

## Task 4: Field-by-field reconciliation (pure)

**Files:**
- Create: `src/features/scratchpad/sync/reconcile.ts`
- Test: `src/features/scratchpad/sync/reconcile.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/sync/reconcile.test.ts
import { describe, expect, it } from "vitest";
import type { Clock } from "./clock";
import { createStoredCard } from "./mutations";
import { isCardDeleted, reconcileCard } from "./reconcile";
import type { Mutation, StoredCard } from "./types";
import type { ScratchpadItem } from "../types";

const clk = (ts: number, deviceId = "a", counter = 0): Clock => ({ ts, counter, deviceId });
const item = (id: string, body = ""): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});
const withBody = (card: StoredCard, body: string, c: Clock): StoredCard => ({
  ...card,
  content: { ...card.content, body },
  clocks: { ...card.clocks, body: c },
});

describe("reconcileCard", () => {
  it("inserts a remote card when there is no local copy", () => {
    const remote = createStoredCard(item("x", "remote"), clk(5, "b"));
    const result = reconcileCard({ local: null, remote, pending: [] });
    expect(result.content.body).toBe("remote");
    expect(result.dirty).toBe(false);
  });

  it("takes a newer remote field when nothing is pending", () => {
    const local = createStoredCard(item("x", "local"), clk(1, "a"));
    const remote = withBody(createStoredCard(item("x"), clk(1, "a")), "remote", clk(9, "b"));
    const result = reconcileCard({ local, remote, pending: [] });
    expect(result.content.body).toBe("remote");
  });

  it("keeps the local field when a pending edit is newer than the remote", () => {
    const local = withBody(createStoredCard(item("x"), clk(1, "a")), "typed offline", clk(20, "a"));
    const remote = withBody(createStoredCard(item("x"), clk(1, "a")), "stale remote", clk(9, "b"));
    const pending: Mutation[] = [{ seq: 1, cardId: "x", field: "body", value: "typed offline", clock: clk(20, "a") }];
    const result = reconcileCard({ local, remote, pending });
    expect(result.content.body).toBe("typed offline");
    expect(result.dirty).toBe(true);
  });

  it("applies a remote tombstone that is the newest stamp", () => {
    const local = createStoredCard(item("x"), clk(1, "a"));
    const remote: StoredCard = { ...createStoredCard(item("x"), clk(1, "a")), deletedAt: 30, deletedClock: clk(30, "b") };
    const result = reconcileCard({ local, remote, pending: [] });
    expect(isCardDeleted(result)).toBe(true);
  });

  it("lets a newer local edit resurrect a card over an older remote tombstone", () => {
    const local = withBody(createStoredCard(item("x"), clk(1, "a")), "alive", clk(40, "a"));
    const remote: StoredCard = { ...createStoredCard(item("x"), clk(1, "a")), deletedAt: 30, deletedClock: clk(30, "b") };
    const pending: Mutation[] = [{ seq: 1, cardId: "x", field: "body", value: "alive", clock: clk(40, "a") }];
    const result = reconcileCard({ local, remote, pending });
    expect(isCardDeleted(result)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/reconcile.test.ts`
Expected: FAIL — cannot find module `./reconcile`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/scratchpad/sync/reconcile.ts
import { type Clock, compareClocks } from "./clock";
import { maxFieldClock } from "./mutations";
import { SCRATCHPAD_FIELD_GROUPS, type Mutation, type StoredCard } from "./types";

export function isCardDeleted(card: StoredCard): boolean {
  if (!card.deletedClock) return false;
  return compareClocks(card.deletedClock, maxFieldClock(card)) >= 0;
}

export interface ReconcileInput {
  local: StoredCard | null;
  remote: StoredCard;
  pending: Mutation[];
}

export function reconcileCard({ local, remote, pending }: ReconcileInput): StoredCard {
  if (!local) {
    return { ...remote, dirty: false };
  }

  const clocks = { ...local.clocks };
  const next: StoredCard = { ...local, clocks };

  for (const g of SCRATCHPAD_FIELD_GROUPS) {
    const pendingNewer = pending.some((m) => m.field === g && compareClocks(m.clock, remote.clocks[g]) > 0);
    if (pendingNewer) continue;
    if (compareClocks(remote.clocks[g], clocks[g]) > 0) {
      clocks[g] = remote.clocks[g];
      if (g === "body") next.content = { ...next.content, body: remote.content.body };
      else if (g === "attachments") next.content = { ...next.content, attachments: remote.content.attachments };
      else if (g === "layout") next.layout = remote.layout;
      else if (g === "tone") next.tone = remote.tone;
    }
  }

  if (remote.deletedClock) {
    const remoteTombstone: Clock = remote.deletedClock;
    const pendingNewerThanTombstone = pending.some((m) => m.field !== "create" && compareClocks(m.clock, remoteTombstone) > 0);
    const beatsLocal = !local.deletedClock || compareClocks(remoteTombstone, local.deletedClock) > 0;
    if (!pendingNewerThanTombstone && beatsLocal) {
      next.deletedAt = remote.deletedAt;
      next.deletedClock = remote.deletedClock;
    }
  }

  next.dirty = pending.length > 0;
  return next;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/reconcile.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/reconcile.ts src/features/scratchpad/sync/reconcile.test.ts
git add src/features/scratchpad/sync/reconcile.ts src/features/scratchpad/sync/reconcile.test.ts
git commit -m "feat(scratchpad): add field-level LWW reconciliation"
```

---

## Task 5: Unified IndexedDB store (cards / outbox / meta)

**Files:**
- Create: `src/features/scratchpad/sync/store.ts`
- Test: `src/features/scratchpad/sync/store.test.ts`
- Modify: `src/features/scratchpad/lib/indexeddb.ts` (open the unified v2 DB instead of its own v1)

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/sync/store.test.ts
import { describe, expect, it } from "vitest";
import { createStoredCard } from "./mutations";
import {
  ackOutbox,
  appendOutbox,
  commitLocalMutation,
  getAllStoredCards,
  getMeta,
  getStoredCard,
  putStoredCard,
  readOutbox,
  setMeta,
} from "./store";
import type { MutationDraft } from "./types";
import type { ScratchpadItem } from "../types";

const clk = { ts: 1, counter: 0, deviceId: "a" };
const item = (id: string): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});
const draft = (cardId: string): MutationDraft => ({ cardId, field: "body", value: "hi", clock: clk });

describe("cards store", () => {
  it("puts, gets, and lists cards", async () => {
    await putStoredCard(createStoredCard(item("x"), clk));
    expect((await getStoredCard("x"))?.id).toBe("x");
    expect(await getStoredCard("nope")).toBeNull();
    await putStoredCard(createStoredCard(item("y"), clk));
    expect((await getAllStoredCards()).map((c) => c.id).sort()).toEqual(["x", "y"]);
  });
});

describe("outbox store", () => {
  it("appends with auto-incrementing seq and reads back in order", async () => {
    const s1 = await appendOutbox(draft("a"));
    const s2 = await appendOutbox(draft("b"));
    expect(s2).toBeGreaterThan(s1);
    expect((await readOutbox()).map((m) => m.seq)).toEqual([s1, s2]);
  });

  it("acks (removes) specific seqs", async () => {
    const s1 = await appendOutbox(draft("a"));
    await appendOutbox(draft("b"));
    await ackOutbox([s1]);
    expect((await readOutbox()).every((m) => m.seq !== s1)).toBe(true);
  });
});

describe("meta store", () => {
  it("round-trips values and returns null for missing keys", async () => {
    expect(await getMeta<string>("syncCursor")).toBeNull();
    await setMeta("syncCursor", "42");
    expect(await getMeta<string>("syncCursor")).toBe("42");
  });
});

describe("commitLocalMutation", () => {
  it("writes the card and appends the outbox entry atomically", async () => {
    const card = createStoredCard(item("x"), clk);
    const seq = await commitLocalMutation(card, draft("x"));
    expect((await getStoredCard("x"))?.id).toBe("x");
    expect((await readOutbox()).map((m) => m.seq)).toContain(seq);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/store.test.ts`
Expected: FAIL — cannot find module `./store`.

- [ ] **Step 3: Write the store implementation**

```ts
// src/features/scratchpad/sync/store.ts
import type { Mutation, MutationDraft, StoredCard } from "./types";

const DB_NAME = "memos-scratch";
const DB_VERSION = 2;

export function openScratchpadDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("files")) {
        const files = db.createObjectStore("files", { keyPath: "id" });
        files.createIndex("uploadedAt", "uploadedAt", { unique: false });
      }
      if (!db.objectStoreNames.contains("cards")) db.createObjectStore("cards", { keyPath: "id" });
      if (!db.objectStoreNames.contains("outbox")) db.createObjectStore("outbox", { keyPath: "seq", autoIncrement: true });
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "key" });
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs", { keyPath: "hash" });
    };
  });
}

export async function getAllStoredCards(): Promise<StoredCard[]> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["cards"], "readonly");
    const req = t.objectStore("cards").getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result ?? []) as StoredCard[]);
    t.oncomplete = () => db.close();
  });
}

export async function getStoredCard(id: string): Promise<StoredCard | null> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["cards"], "readonly");
    const req = t.objectStore("cards").get(id);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result as StoredCard) ?? null);
    t.oncomplete = () => db.close();
  });
}

export async function putStoredCard(card: StoredCard): Promise<void> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["cards"], "readwrite");
    t.objectStore("cards").put(card);
    t.onerror = () => reject(t.error);
    t.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function deleteStoredCard(id: string): Promise<void> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["cards"], "readwrite");
    t.objectStore("cards").delete(id);
    t.onerror = () => reject(t.error);
    t.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function readOutbox(): Promise<Mutation[]> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["outbox"], "readonly");
    const req = t.objectStore("outbox").getAll();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(((req.result ?? []) as Mutation[]).sort((a, b) => a.seq - b.seq));
    t.oncomplete = () => db.close();
  });
}

export async function appendOutbox(draft: MutationDraft): Promise<number> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["outbox"], "readwrite");
    const req = t.objectStore("outbox").add(draft as Mutation);
    let seq = 0;
    req.onerror = () => reject(req.error);
    req.onsuccess = () => {
      seq = req.result as number;
    };
    t.oncomplete = () => {
      db.close();
      resolve(seq);
    };
  });
}

export async function ackOutbox(seqs: number[]): Promise<void> {
  if (seqs.length === 0) return;
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["outbox"], "readwrite");
    const store = t.objectStore("outbox");
    for (const seq of seqs) store.delete(seq);
    t.onerror = () => reject(t.error);
    t.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function commitLocalMutation(card: StoredCard, draft: MutationDraft): Promise<number> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["cards", "outbox"], "readwrite");
    t.objectStore("cards").put(card);
    const req = t.objectStore("outbox").add(draft as Mutation);
    let seq = 0;
    req.onsuccess = () => {
      seq = req.result as number;
    };
    t.onerror = () => reject(t.error);
    t.oncomplete = () => {
      db.close();
      resolve(seq);
    };
  });
}

export async function getMeta<T>(key: string): Promise<T | null> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["meta"], "readonly");
    const req = t.objectStore("meta").get(key);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result ? (req.result.value as T) : null);
    t.oncomplete = () => db.close();
  });
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["meta"], "readwrite");
    t.objectStore("meta").put({ key, value });
    t.onerror = () => reject(t.error);
    t.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/store.test.ts`
Expected: PASS.

- [ ] **Step 5: Point the legacy blob module at the unified DB**

`indexeddb.ts` currently opens `memos-scratch` at version 1, which will throw once the store opens it at version 2. Replace its private opener with the shared one.

In `src/features/scratchpad/lib/indexeddb.ts`, replace the top of the file:

```ts
/**
 * IndexedDB utilities for storing file blobs
 */

import type { FileData } from "../types";

const DB_NAME = "memos-scratch";
const DB_VERSION = 1;
const STORE_NAME = "files";

/**
 * Open IndexedDB connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("uploadedAt", "uploadedAt", { unique: false });
      }
    };
  });
}
```

with:

```ts
/**
 * IndexedDB utilities for storing file blobs.
 * Schema/versioning lives in sync/store.ts (the unified `memos-scratch` DB).
 */

import { openScratchpadDB } from "../sync/store";
import type { FileData } from "../types";

const STORE_NAME = "files";

function openDB(): Promise<IDBDatabase> {
  return openScratchpadDB();
}
```

The rest of `indexeddb.ts` (all CRUD functions) is unchanged — they call `openDB()` and use `STORE_NAME`.

- [ ] **Step 6: Verify the whole scratchpad suite still passes**

Run: `pnpm exec vitest run src/features/scratchpad`
Expected: PASS (existing `indexeddb.test.ts` and all others still green).

- [ ] **Step 7: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/store.ts src/features/scratchpad/sync/store.test.ts src/features/scratchpad/lib/indexeddb.ts
git add src/features/scratchpad/sync/store.ts src/features/scratchpad/sync/store.test.ts src/features/scratchpad/lib/indexeddb.ts
git commit -m "feat(scratchpad): add unified IndexedDB store for cards/outbox/meta"
```

---

## Task 6: Content-addressed blob store

**Files:**
- Create: `src/features/scratchpad/sync/blobs.ts`
- Test: `src/features/scratchpad/sync/blobs.test.ts`

> `crypto.subtle` and `Blob.arrayBuffer()` are available in the Node test runtime. If `Blob.arrayBuffer` is ever missing, fall back to `new Response(blob).arrayBuffer()` — but do not add that unless a test actually fails.

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/sync/blobs.test.ts
import { describe, expect, it } from "vitest";
import { allLocalBlobHashes, deleteLocalBlob, getLocalBlob, hashBlob, hasLocalBlob, putLocalBlob } from "./blobs";

const SHA256_ABC = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

describe("hashBlob", () => {
  it("computes a stable SHA-256 hex digest", async () => {
    expect(await hashBlob(new Blob(["abc"]))).toBe(SHA256_ABC);
  });

  it("gives identical bytes the same hash", async () => {
    expect(await hashBlob(new Blob(["same"]))).toBe(await hashBlob(new Blob(["same"])));
  });
});

describe("local blob store", () => {
  const make = async (text: string) => {
    const blob = new Blob([text]);
    return { hash: await hashBlob(blob), name: `${text}.txt`, type: "text/plain", size: blob.size, blob };
  };

  it("puts, gets, checks existence, lists, and deletes by hash", async () => {
    const rec = await make("hello");
    await putLocalBlob(rec);
    expect((await getLocalBlob(rec.hash))?.name).toBe("hello.txt");
    expect(await hasLocalBlob(rec.hash)).toBe(true);
    expect(await hasLocalBlob("missing")).toBe(false);
    expect(await allLocalBlobHashes()).toEqual([rec.hash]);
    await deleteLocalBlob(rec.hash);
    expect(await getLocalBlob(rec.hash)).toBeNull();
  });

  it("dedupes identical content under one key", async () => {
    const a = await make("dupe");
    const b = await make("dupe");
    await putLocalBlob(a);
    await putLocalBlob(b);
    expect((await allLocalBlobHashes()).length).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/blobs.test.ts`
Expected: FAIL — cannot find module `./blobs`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/scratchpad/sync/blobs.ts
import { openScratchpadDB } from "./store";

export interface StoredBlob {
  hash: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
}

export async function hashBlob(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function putLocalBlob(record: StoredBlob): Promise<void> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["blobs"], "readwrite");
    t.objectStore("blobs").put(record);
    t.onerror = () => reject(t.error);
    t.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function getLocalBlob(hash: string): Promise<StoredBlob | null> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["blobs"], "readonly");
    const req = t.objectStore("blobs").get(hash);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result as StoredBlob) ?? null);
    t.oncomplete = () => db.close();
  });
}

export async function hasLocalBlob(hash: string): Promise<boolean> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["blobs"], "readonly");
    const req = t.objectStore("blobs").count(hash);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result > 0);
    t.oncomplete = () => db.close();
  });
}

export async function deleteLocalBlob(hash: string): Promise<void> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["blobs"], "readwrite");
    t.objectStore("blobs").delete(hash);
    t.onerror = () => reject(t.error);
    t.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function allLocalBlobHashes(): Promise<string[]> {
  const db = await openScratchpadDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(["blobs"], "readonly");
    const req = t.objectStore("blobs").getAllKeys();
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result ?? []) as string[]);
    t.oncomplete = () => db.close();
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/blobs.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/blobs.ts src/features/scratchpad/sync/blobs.test.ts
git add src/features/scratchpad/sync/blobs.ts src/features/scratchpad/sync/blobs.test.ts
git commit -m "feat(scratchpad): add content-addressed blob store"
```

---

## Task 7: SyncBackend port, mock adapter, and contract suite

**Files:**
- Create: `src/features/scratchpad/sync/backend.ts` (interface — no test)
- Create: `src/features/scratchpad/sync/backend-mock.ts`
- Create: `src/features/scratchpad/sync/backend-contract.test.ts` (reusable suite, run against the mock)

- [ ] **Step 1: Create the port interface**

```ts
// src/features/scratchpad/sync/backend.ts
import type { PullRequest, PullResponse, PushRequest, PushResponse } from "./types";

export interface SyncBackend {
  push(req: PushRequest): Promise<PushResponse>;
  pull(req: PullRequest): Promise<PullResponse>;
  hasBlob(hash: string): Promise<boolean>;
  putBlob(hash: string, data: Blob): Promise<void>;
  getBlob(hash: string): Promise<Blob>;
}
```

- [ ] **Step 2: Write the failing contract suite**

```ts
// src/features/scratchpad/sync/backend-contract.test.ts
import { describe, expect, it } from "vitest";
import type { SyncBackend } from "./backend";
import { createMockBackend } from "./backend-mock";
import type { Clock } from "./clock";
import type { Mutation } from "./types";
import type { ScratchpadItem } from "../types";

const clk = (ts: number, deviceId = "a", counter = 0): Clock => ({ ts, counter, deviceId });
const item = (id: string, body = ""): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});
const createMut = (id: string, c = clk(1)): Mutation => ({ seq: 1, cardId: id, field: "create", value: item(id), clock: c });
const bodyMut = (id: string, body: string, c: Clock, seq = 2): Mutation => ({ seq, cardId: id, field: "body", value: body, clock: c });

export function runBackendContract(makeBackend: () => SyncBackend): void {
  describe("SyncBackend contract", () => {
    it("returns pushed cards on a fresh pull and advances the cursor", async () => {
      const be = makeBackend();
      const pushed = await be.push({ mutations: [createMut("x")], cursor: null });
      expect(pushed.acked).toEqual([1]);
      const pulled = await be.pull({ cursor: null });
      expect(pulled.changes.map((c) => c.id)).toEqual(["x"]);
      expect(Number(pulled.cursor)).toBeGreaterThan(0);
    });

    it("only returns changes newer than the supplied cursor", async () => {
      const be = makeBackend();
      const first = await be.push({ mutations: [createMut("x")], cursor: null });
      const second = await be.pull({ cursor: first.cursor });
      expect(second.changes).toEqual([]);
    });

    it("applies LWW: an older body loses to a newer one regardless of push order", async () => {
      const be = makeBackend();
      await be.push({ mutations: [createMut("x", clk(1))], cursor: null });
      await be.push({ mutations: [bodyMut("x", "new", clk(50, "b"))], cursor: null });
      await be.push({ mutations: [bodyMut("x", "old", clk(10, "a"))], cursor: null });
      const pulled = await be.pull({ cursor: null });
      expect(pulled.changes.find((c) => c.id === "x")?.content.body).toBe("new");
    });

    it("stores and retrieves blobs by hash", async () => {
      const be = makeBackend();
      expect(await be.hasBlob("h1")).toBe(false);
      await be.putBlob("h1", new Blob(["x"]));
      expect(await be.hasBlob("h1")).toBe(true);
      expect(await (await be.getBlob("h1")).text()).toBe("x");
    });
  });
}

runBackendContract(() => createMockBackend());
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/backend-contract.test.ts`
Expected: FAIL — cannot find module `./backend-mock`.

- [ ] **Step 4: Write the mock adapter**

```ts
// src/features/scratchpad/sync/backend-mock.ts
import type { SyncBackend } from "./backend";
import { applyMutationToCard, coalesceOutbox, mutationWins } from "./mutations";
import type { Mutation, PullRequest, PullResponse, PushRequest, PushResponse, StoredCard } from "./types";

export function createMockBackend(): SyncBackend {
  const cards = new Map<string, { card: StoredCard; version: number }>();
  const blobs = new Map<string, Blob>();
  let version = 0;

  const applyMutation = (m: Mutation): void => {
    const existing = cards.get(m.cardId)?.card ?? null;
    if (!mutationWins(existing, m)) return;
    const next = applyMutationToCard(existing, m);
    if (!next) return;
    version += 1;
    cards.set(m.cardId, { card: { ...next, dirty: false }, version });
  };

  const changesSince = (cursor: number): StoredCard[] =>
    Array.from(cards.values())
      .filter((e) => e.version > cursor)
      .sort((a, b) => a.version - b.version)
      .map((e) => e.card);

  return {
    async push({ mutations, cursor }: PushRequest): Promise<PushResponse> {
      for (const m of coalesceOutbox(mutations)) applyMutation(m);
      return { acked: mutations.map((m) => m.seq), changes: changesSince(cursor ? Number(cursor) : 0), cursor: String(version) };
    },
    async pull({ cursor }: PullRequest): Promise<PullResponse> {
      return { changes: changesSince(cursor ? Number(cursor) : 0), cursor: String(version) };
    },
    async hasBlob(hash: string): Promise<boolean> {
      return blobs.has(hash);
    },
    async putBlob(hash: string, data: Blob): Promise<void> {
      blobs.set(hash, data);
    },
    async getBlob(hash: string): Promise<Blob> {
      const blob = blobs.get(hash);
      if (!blob) throw new Error(`blob not found: ${hash}`);
      return blob;
    },
  };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/backend-contract.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/backend.ts src/features/scratchpad/sync/backend-mock.ts src/features/scratchpad/sync/backend-contract.test.ts
git add src/features/scratchpad/sync/backend.ts src/features/scratchpad/sync/backend-mock.ts src/features/scratchpad/sync/backend-contract.test.ts
git commit -m "feat(scratchpad): add SyncBackend port, mock adapter, contract suite"
```

---

## Task 8: Multi-device convergence simulation

**Files:**
- Create: `src/features/scratchpad/sync/convergence.test.ts`

> This test simulates two devices with a small in-test `Device` client (its own clock, card map, outbox, cursor) sharing one mock backend. It exercises the real `coalesceOutbox`/`applyMutationToCard`/`reconcileCard`/`receiveClock` logic — the engine's own store wiring is covered separately in Task 9. No new production code.

- [ ] **Step 1: Write the test**

```ts
// src/features/scratchpad/sync/convergence.test.ts
import { describe, expect, it } from "vitest";
import type { SyncBackend } from "./backend";
import { createMockBackend } from "./backend-mock";
import { advanceClock, type Clock, createClock, receiveClock } from "./clock";
import { applyMutationToCard, coalesceOutbox } from "./mutations";
import { SCRATCHPAD_FIELD_GROUPS, type Mutation, type StoredCard } from "./types";
import { isCardDeleted, reconcileCard } from "./reconcile";
import type { ScratchpadItem } from "../types";

const item = (id: string, body = ""): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

class Device {
  clock: Clock;
  cards = new Map<string, StoredCard>();
  outbox: Mutation[] = [];
  cursor: string | null = null;
  private seq = 1;

  constructor(
    deviceId: string,
    private backend: SyncBackend,
    private now: () => number,
  ) {
    this.clock = createClock(deviceId);
  }

  private stamp(): Clock {
    this.clock = advanceClock(this.clock, this.now());
    return this.clock;
  }

  record(field: Mutation["field"], cardId: string, value: Mutation["value"]): void {
    const mutation = { seq: this.seq++, cardId, field, value, clock: this.stamp() } as Mutation;
    this.cards.set(cardId, applyMutationToCard(this.cards.get(cardId) ?? null, mutation) as StoredCard);
    this.outbox.push(mutation);
  }

  async sync(): Promise<void> {
    const pending = coalesceOutbox(this.outbox);
    const resp = pending.length > 0 ? await this.backend.push({ mutations: pending, cursor: this.cursor }) : await this.backend.pull({ cursor: this.cursor });
    this.outbox = [];
    for (const remote of resp.changes) {
      for (const g of SCRATCHPAD_FIELD_GROUPS) this.clock = receiveClock(this.clock, remote.clocks[g], this.now());
      this.cards.set(remote.id, reconcileCard({ local: this.cards.get(remote.id) ?? null, remote, pending: [] }));
    }
    this.cursor = resp.cursor;
  }

  visibleBody(id: string): string | undefined {
    const card = this.cards.get(id);
    return card && !isCardDeleted(card) ? card.content.body : undefined;
  }
}

const harness = () => {
  const backend = createMockBackend();
  let t = 100;
  const now = () => t++;
  return { a: new Device("a", backend, now), b: new Device("b", backend, now) };
};

describe("multi-device convergence", () => {
  it("propagates a card created on A to B", async () => {
    const { a, b } = harness();
    a.record("create", "x", item("x", "from A"));
    await a.sync();
    await b.sync();
    expect(b.visibleBody("x")).toBe("from A");
  });

  it("merges concurrent edits to different fields of one card", async () => {
    const { a, b } = harness();
    a.record("create", "x", item("x"));
    await a.sync();
    await b.sync();
    a.record("layout", "x", { x: 999, y: 0, width: 280, height: 180, zIndex: 1 });
    b.record("body", "x", "edited on B");
    await a.sync();
    await b.sync();
    await a.sync();
    expect(a.cards.get("x")?.layout.x).toBe(999);
    expect(a.visibleBody("x")).toBe("edited on B");
    expect(b.cards.get("x")?.layout.x).toBe(999);
    expect(b.visibleBody("x")).toBe("edited on B");
  });

  it("converges to identical state under conflicting edits to the same field", async () => {
    const { a, b } = harness();
    a.record("create", "x", item("x"));
    await a.sync();
    await b.sync();
    a.record("body", "x", "A version");
    b.record("body", "x", "B version");
    await a.sync();
    await b.sync();
    await a.sync();
    await b.sync();
    expect(a.cards.get("x")?.content.body).toBe(b.cards.get("x")?.content.body);
  });

  it("propagates a deletion from A to B", async () => {
    const { a, b } = harness();
    a.record("create", "x", item("x"));
    await a.sync();
    await b.sync();
    a.record("delete", "x", null);
    await a.sync();
    await b.sync();
    expect(b.visibleBody("x")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/convergence.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 3: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/convergence.test.ts
git add src/features/scratchpad/sync/convergence.test.ts
git commit -m "test(scratchpad): add multi-device convergence simulation"
```

---

## Task 9: Sync engine (loop, triggers, single-flight, recordMutation)

**Files:**
- Create: `src/features/scratchpad/sync/engine.ts`
- Test: `src/features/scratchpad/sync/engine.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/sync/engine.test.ts
import { describe, expect, it } from "vitest";
import type { SyncBackend } from "./backend";
import { createMockBackend } from "./backend-mock";
import { createSyncEngine } from "./engine";
import { getAllStoredCards, getMeta, readOutbox } from "./store";
import type { Mutation } from "./types";
import type { ScratchpadItem } from "../types";

const item = (id: string, body = ""): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

function makeEngine(backend: SyncBackend, onCardsChanged: (ids: string[]) => void = () => {}) {
  let t = 1000;
  return createSyncEngine({
    backend,
    deviceId: "dev-a",
    now: () => t++,
    debounceMs: 5,
    onCardsChanged: (cards) => onCardsChanged(cards.map((c) => c.id)),
  });
}

describe("sync engine", () => {
  it("records a mutation optimistically and flushes it on sync", async () => {
    const backend = createMockBackend();
    const engine = makeEngine(backend);
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x", "hello") });
    expect((await getAllStoredCards()).map((c) => c.id)).toEqual(["x"]);
    await engine.syncNow();
    expect(await readOutbox()).toEqual([]);
    expect((await backend.pull({ cursor: null })).changes.map((c) => c.id)).toEqual(["x"]);
    engine.stop();
  });

  it("persists the cursor to meta after a sync", async () => {
    const backend = createMockBackend();
    const engine = makeEngine(backend);
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    await engine.syncNow();
    expect(await getMeta<string>("syncCursor")).not.toBeNull();
    engine.stop();
  });

  it("retains the outbox when push fails, then flushes on retry", async () => {
    const backend = createMockBackend();
    let fail = true;
    const flaky: SyncBackend = { ...backend, push: async (req) => { if (fail) throw new Error("offline"); return backend.push(req); } };
    const engine = makeEngine(flaky);
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    await engine.syncNow();
    expect((await readOutbox()).length).toBeGreaterThan(0);
    fail = false;
    await engine.syncNow();
    expect(await readOutbox()).toEqual([]);
    engine.stop();
  });

  it("merges a remote change pulled from the backend and notifies the listener", async () => {
    const backend = createMockBackend();
    const changed: string[] = [];
    const engine = makeEngine(backend, (ids) => changed.push(...ids));
    await engine.start();
    const foreign: Mutation = { seq: 1, cardId: "remote", field: "create", value: item("remote", "afar"), clock: { ts: 5, counter: 0, deviceId: "dev-b" } };
    await backend.push({ mutations: [foreign], cursor: null });
    await engine.syncNow();
    expect((await getAllStoredCards()).map((c) => c.id)).toContain("remote");
    expect(changed).toContain("remote");
    engine.stop();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/engine.test.ts`
Expected: FAIL — cannot find module `./engine`.

- [ ] **Step 3: Write minimal implementation**

```ts
// src/features/scratchpad/sync/engine.ts
import type { SyncBackend } from "./backend";
import { advanceClock, type Clock, createClock, receiveClock } from "./clock";
import { applyMutationToCard, coalesceOutbox } from "./mutations";
import { reconcileCard } from "./reconcile";
import { ackOutbox, commitLocalMutation, getMeta, getStoredCard, putStoredCard, readOutbox, setMeta } from "./store";
import { SCRATCHPAD_FIELD_GROUPS, type Mutation, type MutationDraft, type StoredCard } from "./types";
import type { ScratchpadAttachmentRef, ScratchpadCardTone, ScratchpadItem, ScratchpadItemLayout } from "../types";

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
  nextClock(): Clock;
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
    const response = coalesced.length > 0 ? await backend.push({ mutations: coalesced, cursor }) : await backend.pull({ cursor });
    if (coalesced.length > 0) await ackOutbox(raw.map((m) => m.seq));
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
    await syncNow();
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

  return { start, stop, nextClock, recordMutation, requestSync, syncNow };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/engine.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/engine.ts src/features/scratchpad/sync/engine.test.ts
git add src/features/scratchpad/sync/engine.ts src/features/scratchpad/sync/engine.test.ts
git commit -m "feat(scratchpad): add single-flight sync engine"
```

---

## Task 10: Content-addressed blob sync (upload-once, lazy download)

**Files:**
- Modify: `src/features/scratchpad/sync/blobs.ts` (add `uploadMissingBlobs`, `loadAttachmentBlob`)
- Modify: `src/features/scratchpad/sync/engine.ts` (upload referenced blobs before push)
- Test: `src/features/scratchpad/sync/blobs-sync.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/sync/blobs-sync.test.ts
import { describe, expect, it } from "vitest";
import { createMockBackend } from "./backend-mock";
import { getLocalBlob, hashBlob, loadAttachmentBlob, putLocalBlob, uploadMissingBlobs } from "./blobs";
import { createSyncEngine } from "./engine";
import type { ScratchpadAttachmentRef, ScratchpadItem } from "../types";

async function seedLocalBlob(text: string): Promise<ScratchpadAttachmentRef> {
  const blob = new Blob([text]);
  const hash = await hashBlob(blob);
  await putLocalBlob({ hash, name: `${text}.txt`, type: "text/plain", size: blob.size, blob });
  return { id: `id-${text}`, name: `${text}.txt`, type: "text/plain", size: blob.size, hash };
}

describe("uploadMissingBlobs", () => {
  it("uploads a referenced blob the backend does not yet have", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    await uploadMissingBlobs(backend, [ref]);
    expect(await backend.hasBlob(ref.hash as string)).toBe(true);
  });

  it("skips blobs the backend already has and ignores refs without a hash", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    await backend.putBlob(ref.hash as string, new Blob(["pic"]));
    await uploadMissingBlobs(backend, [ref, { id: "legacy", name: "l", type: "text/plain", size: 1 }]);
    expect(await backend.hasBlob(ref.hash as string)).toBe(true);
  });
});

describe("loadAttachmentBlob", () => {
  it("returns the local blob without touching the backend", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    const blob = await loadAttachmentBlob(backend, ref);
    expect(await blob?.text()).toBe("pic");
  });

  it("downloads from the backend on a local miss and caches it", async () => {
    const backend = createMockBackend();
    const blob = new Blob(["remote"]);
    const hash = await hashBlob(blob);
    await backend.putBlob(hash, blob);
    const ref: ScratchpadAttachmentRef = { id: "r", name: "r.txt", type: "text/plain", size: blob.size, hash };
    const loaded = await loadAttachmentBlob(backend, ref);
    expect(await loaded?.text()).toBe("remote");
    expect(await getLocalBlob(hash)).not.toBeNull();
  });
});

describe("engine uploads referenced blobs before pushing", () => {
  it("makes attachment bytes available on the backend after sync", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    const engine = createSyncEngine({ backend, deviceId: "dev-a", now: (() => { let t = 1; return () => t++; })(), debounceMs: 5 });
    await engine.start();
    const card: ScratchpadItem = {
      id: "x",
      layout: { x: 0, y: 0, width: 320, height: 300, zIndex: 1 },
      content: { body: "", attachments: [ref] },
      timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
    };
    await engine.recordMutation({ cardId: "x", field: "create", value: card });
    await engine.syncNow();
    expect(await backend.hasBlob(ref.hash as string)).toBe(true);
    engine.stop();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/blobs-sync.test.ts`
Expected: FAIL — `uploadMissingBlobs`/`loadAttachmentBlob` are not exported.

- [ ] **Step 3: Add the blob-sync helpers**

Append to `src/features/scratchpad/sync/blobs.ts` (and add the import at the top):

```ts
import type { SyncBackend } from "./backend";
import type { ScratchpadAttachmentRef } from "../types";
```

```ts
export async function uploadMissingBlobs(backend: SyncBackend, refs: ScratchpadAttachmentRef[]): Promise<void> {
  const seen = new Set<string>();
  for (const ref of refs) {
    if (!ref.hash || seen.has(ref.hash)) continue;
    seen.add(ref.hash);
    if (await backend.hasBlob(ref.hash)) continue;
    const local = await getLocalBlob(ref.hash);
    if (local) await backend.putBlob(ref.hash, local.blob);
  }
}

export async function loadAttachmentBlob(backend: SyncBackend, ref: ScratchpadAttachmentRef): Promise<Blob | null> {
  if (!ref.hash) return null;
  const local = await getLocalBlob(ref.hash);
  if (local) return local.blob;
  try {
    const blob = await backend.getBlob(ref.hash);
    await putLocalBlob({ hash: ref.hash, name: ref.name, type: ref.type, size: ref.size, blob });
    return blob;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Upload referenced blobs before pushing**

In `src/features/scratchpad/sync/engine.ts`, update the imports:

```ts
import { ackOutbox, commitLocalMutation, getMeta, getStoredCard, putStoredCard, readOutbox, setMeta } from "./store";
```

becomes

```ts
import { ackOutbox, commitLocalMutation, getAllStoredCards, getMeta, getStoredCard, putStoredCard, readOutbox, setMeta } from "./store";
```

Add to the types import a `PullResponse, PushResponse`:

```ts
import { SCRATCHPAD_FIELD_GROUPS, type Mutation, type MutationDraft, type PullResponse, type PushResponse, type StoredCard } from "./types";
```

Add the blobs import:

```ts
import { uploadMissingBlobs } from "./blobs";
```

Then replace the push/pull lines inside `runCycle`:

```ts
    const response = coalesced.length > 0 ? await backend.push({ mutations: coalesced, cursor }) : await backend.pull({ cursor });
    if (coalesced.length > 0) await ackOutbox(raw.map((m) => m.seq));
```

with:

```ts
    let response: PushResponse | PullResponse;
    if (coalesced.length > 0) {
      const cards = await getAllStoredCards();
      await uploadMissingBlobs(backend, cards.flatMap((c) => c.content.attachments));
      response = await backend.push({ mutations: coalesced, cursor });
      await ackOutbox(raw.map((m) => m.seq));
    } else {
      response = await backend.pull({ cursor });
    }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm exec vitest run src/features/scratchpad/sync/blobs-sync.test.ts src/features/scratchpad/sync/engine.test.ts`
Expected: PASS (both files green — the engine change must not regress Task 9).

- [ ] **Step 6: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/blobs.ts src/features/scratchpad/sync/engine.ts src/features/scratchpad/sync/blobs-sync.test.ts
git add src/features/scratchpad/sync/blobs.ts src/features/scratchpad/sync/engine.ts src/features/scratchpad/sync/blobs-sync.test.ts
git commit -m "feat(scratchpad): sync attachment blobs content-addressed, lazy download"
```

---

## Task 11: Device id and one-time migration

**Files:**
- Create: `src/features/scratchpad/sync/device.ts`
- Create: `src/features/scratchpad/sync/migration.ts`
- Test: `src/features/scratchpad/sync/migration.test.ts`

- [ ] **Step 1: Create the device id helper**

```ts
// src/features/scratchpad/sync/device.ts
const DEVICE_ID_KEY = "memos-scratch-device-id";

export function getOrCreateDeviceId(): string {
  if (typeof localStorage === "undefined") return "server";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
```

- [ ] **Step 2: Write the failing migration test**

```ts
// src/features/scratchpad/sync/migration.test.ts
import { describe, expect, it } from "vitest";
import { saveFile } from "../lib/indexeddb";
import { itemStorage } from "../lib/storage";
import { allLocalBlobHashes, hashBlob } from "./blobs";
import { runScratchpadMigration } from "./migration";
import { getAllStoredCards, getMeta } from "./store";
import type { ScratchpadItem, ScratchpadViewport } from "../types";

const clock = (() => {
  let t = 1;
  return () => t++;
})();

async function seedLegacy(): Promise<{ hash: string }> {
  const blob = new Blob(["pic"]);
  const fileId = "file-1";
  await saveFile({ id: fileId, name: "pic.png", type: "image/png", size: blob.size, blob, uploadedAt: new Date(0) });
  const item: ScratchpadItem = {
    id: "x",
    layout: { x: 0, y: 0, width: 320, height: 300, zIndex: 1 },
    content: { body: "hi", attachments: [{ id: fileId, name: "pic.png", type: "image/png", size: blob.size }] },
    timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
  };
  itemStorage.save([item]);
  return { hash: await hashBlob(blob) };
}

describe("runScratchpadMigration", () => {
  it("moves items into the cards store and backfills attachment hashes", async () => {
    const { hash } = await seedLegacy();
    await runScratchpadMigration("dev-a", clock);
    const cards = await getAllStoredCards();
    expect(cards.map((c) => c.id)).toEqual(["x"]);
    expect(cards[0].dirty).toBe(true);
    expect(cards[0].content.attachments[0].hash).toBe(hash);
    expect(await allLocalBlobHashes()).toContain(hash);
    expect(await getMeta<boolean>("migratedV2")).toBe(true);
    expect(await getMeta<ScratchpadViewport>("viewport")).not.toBeNull();
    expect(localStorage.getItem("memos-scratch-items")).toBeNull();
  });

  it("is a no-op on a second run", async () => {
    await seedLegacy();
    await runScratchpadMigration("dev-a", clock);
    await runScratchpadMigration("dev-a", clock);
    expect((await getAllStoredCards()).length).toBe(1);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/sync/migration.test.ts`
Expected: FAIL — cannot find module `./migration`.

- [ ] **Step 4: Write the migration**

```ts
// src/features/scratchpad/sync/migration.ts
import { getAllFiles } from "../lib/indexeddb";
import { itemStorage, viewportStorage } from "../lib/storage";
import { hashBlob, putLocalBlob } from "./blobs";
import { createClock } from "./clock";
import { getAllStoredCards, getMeta, putStoredCard, setMeta } from "./store";
import type { StoredCard } from "./types";
import type { ScratchpadViewport } from "../types";

const MIGRATION_FLAG = "migratedV2";
const LEGACY_ITEMS_KEY = "memos-scratch-items";

export async function runScratchpadMigration(deviceId: string, now: () => number = () => Date.now()): Promise<void> {
  if (await getMeta<boolean>(MIGRATION_FLAG)) return;

  const clock0 = createClock(deviceId, now(), 0);
  for (const item of itemStorage.getAll()) {
    const card: StoredCard = {
      ...item,
      clocks: { body: clock0, layout: clock0, tone: clock0, attachments: clock0 },
      deletedAt: null,
      deletedClock: null,
      dirty: true,
    };
    await putStoredCard(card);
  }

  const idToHash = new Map<string, string>();
  for (const file of await getAllFiles()) {
    const hash = await hashBlob(file.blob);
    await putLocalBlob({ hash, name: file.name, type: file.type, size: file.size, blob: file.blob });
    idToHash.set(file.id, hash);
  }
  if (idToHash.size > 0) {
    for (const card of await getAllStoredCards()) {
      let changed = false;
      const attachments = card.content.attachments.map((ref) => {
        const hash = idToHash.get(ref.id);
        if (hash && ref.hash !== hash) {
          changed = true;
          return { ...ref, hash };
        }
        return ref;
      });
      if (changed) await putStoredCard({ ...card, content: { ...card.content, attachments } });
    }
  }

  await setMeta<ScratchpadViewport>("viewport", viewportStorage.get());
  await setMeta(MIGRATION_FLAG, true);

  if (typeof localStorage !== "undefined") localStorage.removeItem(LEGACY_ITEMS_KEY);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/sync/migration.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/sync/device.ts src/features/scratchpad/sync/migration.ts src/features/scratchpad/sync/migration.test.ts
git add src/features/scratchpad/sync/device.ts src/features/scratchpad/sync/migration.ts src/features/scratchpad/sync/migration.test.ts
git commit -m "feat(scratchpad): add device id and localStorage->IndexedDB migration"
```

---

## Task 12: `merge-cards` reducer action

The engine notifies the hook of merged/remote cards; the reducer needs a way to fold them into the in-memory view without re-triggering persistence.

**Files:**
- Modify: `src/features/scratchpad/lib/editor.ts`
- Test: `src/features/scratchpad/lib/editor.test.ts` (create if absent; otherwise append)

- [ ] **Step 1: Write the failing test**

```ts
// src/features/scratchpad/lib/editor.test.ts
import { describe, expect, it } from "vitest";
import { createScratchpadEditorState, scratchpadEditorReducer } from "./editor";
import type { ScratchpadItem } from "../types";

const item = (id: string, body = ""): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

const hydrated = () =>
  scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "hydrate",
    items: [item("a", "old"), item("b")],
    viewport: { x: 0, y: 0, scale: 1 },
  });

describe("merge-cards", () => {
  it("upserts new and existing cards and removes deleted ones", () => {
    const next = scratchpadEditorReducer(hydrated(), {
      type: "merge-cards",
      upserts: [item("a", "new"), item("c")],
      removedIds: ["b"],
    });
    expect(next.document.items.map((i) => i.id).sort()).toEqual(["a", "c"]);
    expect(next.document.items.find((i) => i.id === "a")?.content.body).toBe("new");
    expect(next.lastTransaction).toBeNull();
  });

  it("clears selection and lastActive for removed cards", () => {
    const selected = scratchpadEditorReducer(hydrated(), {
      type: "run-transaction",
      id: 1,
      reason: "sel",
      persistence: "none",
      operations: [{ type: "select-item", id: "a", additive: false }],
    });
    const next = scratchpadEditorReducer(selected, { type: "merge-cards", upserts: [], removedIds: ["a"] });
    expect(next.selectedItemIds).toEqual([]);
    expect(next.lastActiveItemId).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/lib/editor.test.ts`
Expected: FAIL — `merge-cards` is not a known action (TS error / no state change).

- [ ] **Step 3: Add the action type and reducer case**

In `src/features/scratchpad/lib/editor.ts`, extend the action union:

```ts
type ScratchpadEditorAction =
  | { type: "hydrate"; items: ScratchpadItem[]; viewport: ScratchpadViewport }
  | { type: "merge-cards"; upserts: ScratchpadItem[]; removedIds: string[] }
  | {
      type: "run-transaction";
      id: number;
      reason: string;
      persistence: ScratchpadTransactionPersistence;
      operations: ScratchpadEditorOperation[];
    };
```

Add the case to `scratchpadEditorReducer`, right after the `case "hydrate":` block:

```ts
    case "merge-cards": {
      const removed = new Set(action.removedIds);
      const upserts = new Map(action.upserts.map((card) => [card.id, card]));
      const kept = state.document.items.filter((item) => !removed.has(item.id)).map((item) => upserts.get(item.id) ?? item);
      const keptIds = new Set(kept.map((item) => item.id));
      const added = action.upserts.filter((card) => !keptIds.has(card.id) && !removed.has(card.id));
      return {
        ...state,
        document: { items: [...kept, ...added] },
        selectedItemIds: state.selectedItemIds.filter((id) => !removed.has(id)),
        lastActiveItemId: state.lastActiveItemId && removed.has(state.lastActiveItemId) ? null : state.lastActiveItemId,
        lastTransaction: null,
      };
    }
```

> `lastTransaction: null` is deliberate — a merge originates from sync, so it must not echo back into persistence or the broadcast channel.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/features/scratchpad/lib/editor.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/lib/editor.ts src/features/scratchpad/lib/editor.test.ts
git add src/features/scratchpad/lib/editor.ts src/features/scratchpad/lib/editor.test.ts
git commit -m "feat(scratchpad): add merge-cards reducer action for sync"
```

---

## Task 13: Wire the engine into the editor hook

Replace `localStorage` persistence with the IndexedDB store + sync engine. Each action still updates the reducer for instant UI, and now also records a `Mutation`, broadcasts to other tabs, and lets the engine sync. Hydration reads from the store; the migration runs once on mount.

**Files:**
- Modify (rewrite): `src/features/scratchpad/hooks/use-scratchpad-editor.ts`
- Modify: `src/features/scratchpad/hooks/use-scratchpad-editor.test.tsx`
- Modify: `src/features/scratchpad/hooks/use-attachment-previews.ts`

- [ ] **Step 1: Update the persistence test to assert the IndexedDB store**

In `src/features/scratchpad/hooks/use-scratchpad-editor.test.tsx`, change the import:

```ts
import { itemStorage } from "../lib/storage";
```

to:

```ts
import { getAllStoredCards } from "../sync/store";
```

and add `waitFor` to the existing `@testing-library/react` import (it is already imported alongside `act` and `renderHook`).

Then replace the body of the "creates a text item and persists it immediately" test:

```ts
  it("creates a text item and persists it immediately", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(100, 100));

    expect(result.current.items).toHaveLength(1);
    expect(itemStorage.getAll()).toHaveLength(1); // immediate persistence
  });
```

with:

```ts
  it("creates a text item and persists it to the store", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(100, 100));

    expect(result.current.items).toHaveLength(1);
    await waitFor(async () => expect((await getAllStoredCards()).length).toBe(1));
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm exec vitest run src/features/scratchpad/hooks/use-scratchpad-editor.test.tsx`
Expected: FAIL — `../sync/store` import resolves, but the current hook never writes to the cards store, so `getAllStoredCards()` stays empty.

- [ ] **Step 3: Rewrite the hook**

Replace the entire contents of `src/features/scratchpad/hooks/use-scratchpad-editor.ts` with:

```tsx
"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  createScratchpadEditorState,
  createScratchpadItem,
  getNextScratchpadZIndex,
  getScratchpadItem,
  type ScratchpadEditorOperation,
  type ScratchpadTransactionPersistence,
  scratchpadEditorReducer,
} from "@/features/scratchpad/lib/editor";
import { calculateScratchpadItemLayout } from "@/features/scratchpad/lib/item-positioning";
import { clampScratchpadScale, DEFAULT_SCRATCHPAD_VIEWPORT } from "@/features/scratchpad/lib/viewport";
import { createMockBackend } from "@/features/scratchpad/sync/backend-mock";
import { hashBlob, putLocalBlob } from "@/features/scratchpad/sync/blobs";
import { getOrCreateDeviceId } from "@/features/scratchpad/sync/device";
import { createSyncEngine, type SyncEngine } from "@/features/scratchpad/sync/engine";
import { runScratchpadMigration } from "@/features/scratchpad/sync/migration";
import { isCardDeleted } from "@/features/scratchpad/sync/reconcile";
import { getAllStoredCards, getMeta, setMeta } from "@/features/scratchpad/sync/store";
import type { StoredCard } from "@/features/scratchpad/sync/types";
import type {
  ScratchpadAttachmentRef,
  ScratchpadItem,
  ScratchpadItemLayout,
  ScratchpadItemPatch,
  ScratchpadViewport,
} from "@/features/scratchpad/types";

const BROADCAST_CHANNEL = "memos-scratch-sync";

type ViewportUpdater = ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport);

interface CardsBroadcast {
  upserts: ScratchpadItem[];
  removedIds: string[];
}

function toScratchpadItem(card: StoredCard): ScratchpadItem {
  return {
    id: card.id,
    layout: card.layout,
    content: card.content,
    timestamps: card.timestamps,
    ...(card.tone ? { tone: card.tone } : {}),
  };
}

async function persistUploadedFile(file: File | Blob): Promise<ScratchpadAttachmentRef> {
  const name = file instanceof File ? file.name : "untitled";
  const type = file.type || "application/octet-stream";
  const hash = await hashBlob(file);
  await putLocalBlob({ hash, name, type, size: file.size, blob: file });
  return { id: `att-${hash}`, name, type, size: file.size, hash };
}

export function useScratchpadEditor() {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(scratchpadEditorReducer, undefined, createScratchpadEditorState);
  const stateRef = useRef(state);
  const viewportRef = useRef(state.viewport);
  const nextTransactionIdRef = useRef(1);
  const engineRef = useRef<SyncEngine | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    viewportRef.current = state.viewport;
  }, [state.viewport]);

  // Mount: migrate once, hydrate from IndexedDB, start the engine, listen cross-tab.
  useEffect(() => {
    let active = true;
    const deviceId = getOrCreateDeviceId();
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(BROADCAST_CHANNEL) : null;
    channelRef.current = channel;

    const applyBroadcast = (payload: CardsBroadcast) => {
      dispatch({ type: "merge-cards", upserts: payload.upserts, removedIds: payload.removedIds });
    };
    if (channel) channel.onmessage = (event: MessageEvent<CardsBroadcast>) => applyBroadcast(event.data);

    const engine = createSyncEngine({
      backend: createMockBackend(),
      deviceId,
      onCardsChanged: (cards) => {
        const removedIds = cards.filter(isCardDeleted).map((c) => c.id);
        const upserts = cards.filter((c) => !isCardDeleted(c)).map(toScratchpadItem);
        const payload: CardsBroadcast = { upserts, removedIds };
        applyBroadcast(payload);
        channel?.postMessage(payload);
      },
    });
    engineRef.current = engine;

    const boot = async () => {
      await runScratchpadMigration(deviceId);
      const cards = await getAllStoredCards();
      const items = cards.filter((c) => !isCardDeleted(c)).map(toScratchpadItem);
      const savedViewport = (await getMeta<ScratchpadViewport>("viewport")) ?? DEFAULT_SCRATCHPAD_VIEWPORT;
      if (!active) return;
      dispatch({
        type: "hydrate",
        items,
        viewport: { ...savedViewport, scale: clampScratchpadScale(savedViewport.scale) },
      });
      setIsClient(true);
      await engine.start();
    };
    void boot();

    return () => {
      active = false;
      engine.stop();
      channel?.close();
      engineRef.current = null;
      channelRef.current = null;
    };
  }, []);

  // Device-local viewport persists to meta (never synced).
  useEffect(() => {
    if (!isClient) return;
    const timeoutId = window.setTimeout(() => {
      void setMeta("viewport", stateRef.current.viewport);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [isClient, state.viewport]);

  const runTransaction = (
    reason: string,
    operations: ScratchpadEditorOperation[],
    persistence: ScratchpadTransactionPersistence = "debounced",
  ) => {
    if (operations.length === 0) return;
    dispatch({ type: "run-transaction", id: nextTransactionIdRef.current, reason, persistence, operations });
    nextTransactionIdRef.current += 1;
  };

  const broadcastLocal = (payload: CardsBroadcast) => channelRef.current?.postMessage(payload);

  const setViewport = (updater: ViewportUpdater) => {
    const nextViewport = typeof updater === "function" ? updater(stateRef.current.viewport) : updater;
    runTransaction(
      "viewport.set",
      [{ type: "set-viewport", viewport: { ...nextViewport, scale: clampScratchpadScale(nextViewport.scale) } }],
      "debounced",
    );
  };

  const patchItem = (
    id: string,
    patch: ScratchpadItemPatch,
    persistence: ScratchpadTransactionPersistence = "debounced",
    reason: string = "item.patch",
  ) => {
    runTransaction(reason, [{ type: "patch-item", id, patch }], persistence);
  };

  const createPositionedItem = (x: number, y: number, attachments: ScratchpadAttachmentRef[] = []) => {
    const zIndex = getNextScratchpadZIndex(stateRef.current.document.items);
    const item = createScratchpadItem(x, y, zIndex, attachments);
    return {
      ...item,
      layout: calculateScratchpadItemLayout({
        x,
        y,
        hasAttachments: attachments.length > 0,
        viewport: viewportRef.current,
        viewportSize: { width: window.innerWidth, height: window.innerHeight },
        zIndex,
      }),
    };
  };

  const createTextItem = (x: number, y: number) => {
    const item = createPositionedItem(x, y);
    runTransaction("item.create", [{ type: "add-item", item }], "immediate");
    void engineRef.current?.recordMutation({ cardId: item.id, field: "create", value: item });
    broadcastLocal({ upserts: [item], removedIds: [] });
  };

  const updateItemLayout = (id: string, updates: Partial<ScratchpadItemLayout>) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    const layout = { ...item.layout, ...updates };
    patchItem(id, { layout: updates }, "immediate", "item.layout");
    void engineRef.current?.recordMutation({ cardId: id, field: "layout", value: layout });
    broadcastLocal({ upserts: [{ ...item, layout }], removedIds: [] });
  };

  const updateItemBody = (id: string, body: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    patchItem(id, { content: { body }, timestamps: { updatedAt: new Date() } }, "debounced", "item.body");
    void engineRef.current?.recordMutation({ cardId: id, field: "body", value: body });
    broadcastLocal({ upserts: [{ ...item, content: { ...item.content, body } }], removedIds: [] });
  };

  const deleteItems = async (ids: string[]) => {
    runTransaction("item.delete", [{ type: "delete-items", ids }], "immediate");
    await Promise.all(ids.map((id) => engineRef.current?.recordMutation({ cardId: id, field: "delete", value: null })));
    broadcastLocal({ upserts: [], removedIds: ids });
  };

  const deleteItem = async (id: string) => {
    await deleteItems([id]);
  };

  const removeAttachment = async (id: string, attachmentId: string) => {
    const item = getScratchpadItem(stateRef.current.document.items, id);
    if (!item) return;
    const attachments = item.content.attachments.filter((a) => a.id !== attachmentId);
    patchItem(id, { content: { attachments }, timestamps: { updatedAt: new Date() } }, "immediate", "item.remove-attachment");
    await engineRef.current?.recordMutation({ cardId: id, field: "attachments", value: attachments });
    broadcastLocal({ upserts: [{ ...item, content: { ...item.content, attachments } }], removedIds: [] });
  };

  const uploadFiles = async (files: FileList, x: number, y: number, targetItemId?: string) => {
    const refs: ScratchpadAttachmentRef[] = [];
    for (const file of Array.from(files)) refs.push(await persistUploadedFile(file));

    if (targetItemId) {
      const target = getScratchpadItem(stateRef.current.document.items, targetItemId);
      if (target) {
        const attachments = [...target.content.attachments, ...refs];
        patchItem(targetItemId, { content: { attachments }, timestamps: { updatedAt: new Date() } }, "immediate", "item.attach-files");
        await engineRef.current?.recordMutation({ cardId: targetItemId, field: "attachments", value: attachments });
        broadcastLocal({ upserts: [{ ...target, content: { ...target.content, attachments } }], removedIds: [] });
        return;
      }
    }

    const item = createPositionedItem(x, y, refs);
    runTransaction("item.create-with-files", [{ type: "add-item", item }], "immediate");
    await engineRef.current?.recordMutation({ cardId: item.id, field: "create", value: item });
    broadcastLocal({ upserts: [item], removedIds: [] });
  };

  const selectItem = (id: string | null, additive: boolean = false) => {
    if (id === null) {
      runTransaction("selection.clear", [{ type: "clear-selection" }], "none");
      return;
    }
    runTransaction("selection.set", [{ type: "select-item", id, additive }], "none");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((e.key === "Delete" || e.key === "Backspace") && stateRef.current.selectedItemIds.length > 0 && !isTyping) {
        e.preventDefault();
        void deleteItems(stateRef.current.selectedItemIds);
      }

      if (e.key === "Escape") {
        runTransaction("selection.clear", [{ type: "clear-selection" }], "none");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    isClient,
    items: state.document.items,
    selectedItemIds: state.selectedItemIds,
    lastActiveItemId: state.lastActiveItemId,
    viewport: state.viewport,
    setViewport,
    patchItem,
    createTextItem,
    updateItemBody,
    updateItemLayout,
    uploadFiles,
    removeAttachment,
    deleteItem,
    deleteItems,
    selectItem,
    clearSelection: () => runTransaction("selection.clear", [{ type: "clear-selection" }], "none"),
  };
}
```

> Note: `tone` is in the field-group set for forward compatibility, but no current UI action sets a card tone, so no tone mutation is emitted yet. When a "change tone" action is added, give it the same `dispatch` + `recordMutation({ field: "tone", value })` + `broadcastLocal` shape as the others.

- [ ] **Step 4: Make attachment previews fall back to the hash-keyed blob store**

Newly uploaded files live only in the content-addressed `blobs` store, so `getFile(id)` misses them. In `src/features/scratchpad/hooks/use-attachment-previews.ts`, add the import:

```ts
import { getLocalBlob } from "../sync/blobs";
```

and replace the `const fileData = await getFile(attachment.id);` line inside `loadAttachments` with:

```ts
          let fileData = await getFile(attachment.id);
          if (!fileData && attachment.hash) {
            const local = await getLocalBlob(attachment.hash);
            if (local) {
              fileData = { id: attachment.id, name: local.name, type: local.type, size: local.size, blob: local.blob, uploadedAt: new Date() };
            }
          }
```

(The rest of the function — the `if (cancelled || !fileData)` guard and the image preview branch — is unchanged. `getFile` is still imported and still serves migrated/legacy id-keyed blobs.)

- [ ] **Step 5: Run the scratchpad hook + previews tests**

Run: `pnpm exec vitest run src/features/scratchpad/hooks`
Expected: PASS — the rewritten persistence test, the unchanged previews test, and the other hook tests are all green.

- [ ] **Step 6: Run the entire scratchpad suite and type-check**

Run: `pnpm exec vitest run src/features/scratchpad && pnpm exec tsc --noEmit`
Expected: PASS — no failures, no type errors.

- [ ] **Step 7: Commit**

```bash
pnpm exec biome check --write src/features/scratchpad/hooks/use-scratchpad-editor.ts src/features/scratchpad/hooks/use-scratchpad-editor.test.tsx src/features/scratchpad/hooks/use-attachment-previews.ts
git add src/features/scratchpad/hooks/use-scratchpad-editor.ts src/features/scratchpad/hooks/use-scratchpad-editor.test.tsx src/features/scratchpad/hooks/use-attachment-previews.ts
git commit -m "feat(scratchpad): drive persistence through the local-first sync engine"
```

---

## Final verification

- [ ] **Run the full test suite**

Run: `pnpm test`
Expected: PASS — all scratchpad sync tests plus the existing suite.

- [ ] **Type-check and lint the whole project**

Run: `pnpm exec tsc --noEmit && pnpm lint`
Expected: PASS (Biome clean; the static-revalidate and metadata audits in `lint` are unaffected).

- [ ] **Manual smoke (optional but recommended)**

Run: `pnpm dev`, open `/scratchpad`, create/move/edit/delete cards and attach an image, reload the page. Everything should persist (now from IndexedDB). Open a second tab on the same page and confirm edits in one tab appear in the other (cross-tab `BroadcastChannel`).

---

## Spec coverage map

| Spec section | Implemented by |
|---|---|
| §1 Unified local store (cards/outbox/meta/blobs) | Task 5, Task 6 |
| §1 Data model (`StoredCard`, field-group clocks) | Task 2 |
| §1 Migration (localStorage→IndexedDB, blob re-key) | Task 11 |
| §2 Hybrid logical clock | Task 1 |
| §2 Mutations + outbox coalescing | Task 3, Task 5 |
| §2 Atomic optimistic write | Task 5 (`commitLocalMutation`), Task 9 (`recordMutation`) |
| §3 Sync loop, triggers, single-flight, backoff | Task 9 |
| §3 Reconciliation + pending-wins invariant | Task 4, Task 9 |
| §4 Content-addressed attachments, lazy download, GC-by-refcount | Task 6, Task 10 |
| §5 Reducer integration over BroadcastChannel | Task 12, Task 13 |
| Mock adapter + reusable contract suite | Task 7 |
| Multi-device convergence | Task 8 |
| Sign-in adopt (cards already local → push up on first sync) | Inherent in Task 9/13: local cards are `dirty` and flow up the normal push path (no special code) |
| Testing strategy (8 areas) | Tasks 1–13 (each ships its tests) |

> **Deferred to the backend spec (out of scope here):** server-side D1/R2 adapter + API routes, server-side GC of unreferenced blobs, real-time push transport, and backend-backed lazy blob download wired through the preview hook. The `SyncBackend` contract suite (Task 7) is the acceptance gate for that adapter.

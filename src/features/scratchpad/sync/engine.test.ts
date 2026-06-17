import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import type { SyncBackend } from "./backend";
import { createMockBackend } from "./backend-mock";
import { compareClocks } from "./clock";
import { createSyncEngine } from "./engine";
import { isCardDeleted } from "./reconcile";
import { getAllStoredCards, getMeta, getStoredCard, readOutbox, setMeta } from "./store";
import type { Mutation } from "./types";

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
    // Large debounce so the only syncs are the explicit syncNow() calls below;
    // a background debounce-sync racing the asserted one makes this nondeterministic.
    debounceMs: 1_000_000,
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
    const flaky: SyncBackend = {
      ...backend,
      push: async (req) => {
        if (fail) throw new Error("offline");
        return backend.push(req);
      },
    };
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
    const foreign: Mutation = {
      seq: 1,
      cardId: "remote",
      field: "create",
      value: item("remote", "afar"),
      clock: { ts: 5, counter: 0, deviceId: "dev-b" },
    };
    await backend.push({ mutations: [foreign], cursor: null });
    await engine.syncNow();
    expect((await getAllStoredCards()).map((c) => c.id)).toContain("remote");
    expect(changed).toContain("remote");
    engine.stop();
  });

  it("coalesces repeated edits into one push and clears the outbox", async () => {
    const backend = createMockBackend();
    const engine = makeEngine(backend);
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    await engine.recordMutation({ cardId: "x", field: "body", value: "a" });
    await engine.recordMutation({ cardId: "x", field: "body", value: "b" });
    await engine.recordMutation({ cardId: "x", field: "body", value: "c" });
    expect((await readOutbox()).length).toBe(4);
    await engine.syncNow();
    expect(await readOutbox()).toEqual([]);
    expect((await backend.pull({ cursor: null })).changes.find((c) => c.id === "x")?.content.body).toBe("c");
    engine.stop();
  });

  it("keeps a local edit that is newer than a stale remote edit", async () => {
    const backend = createMockBackend();
    const engine = makeEngine(backend);
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    await engine.syncNow();
    // A foreign device edits the body with an older clock; the local edit is newer.
    const stale: Mutation = { seq: 1, cardId: "x", field: "body", value: "stale", clock: { ts: 5, counter: 0, deviceId: "dev-z" } };
    await backend.push({ mutations: [stale], cursor: null });
    await engine.recordMutation({ cardId: "x", field: "body", value: "fresh" });
    await engine.syncNow();
    expect((await getStoredCard("x"))?.content.body).toBe("fresh");
    engine.stop();
  });

  it("resumes the logical clock from meta on start", async () => {
    await setMeta("syncClock", { ts: 9999, counter: 5, deviceId: "dev-a" });
    const engine = makeEngine(createMockBackend());
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    const mutation = (await readOutbox())[0];
    expect(mutation.clock.ts).toBe(9999);
    expect(mutation.clock.counter).toBe(6);
    engine.stop();
  });

  it("advances its clock past a remote card's clock on merge", async () => {
    const backend = createMockBackend();
    const engine = makeEngine(backend);
    await engine.start();
    const foreign: Mutation = {
      seq: 1,
      cardId: "remote",
      field: "create",
      value: item("remote"),
      clock: { ts: 50_000, counter: 0, deviceId: "dev-z" },
    };
    await backend.push({ mutations: [foreign], cursor: null });
    await engine.syncNow();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    const localCreate = (await readOutbox()).find((m) => m.cardId === "x");
    expect(localCreate?.clock.ts).toBeGreaterThanOrEqual(50_000);
    expect(localCreate && compareClocks(localCreate.clock, foreign.clock)).toBe(1);
    engine.stop();
  });

  it("tombstones a card through the engine on delete, on both client and server", async () => {
    const backend = createMockBackend();
    const engine = makeEngine(backend);
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    await engine.syncNow();
    await engine.recordMutation({ cardId: "x", field: "delete", value: null });
    await engine.syncNow();
    const stored = await getStoredCard("x");
    expect(stored && isCardDeleted(stored)).toBe(true);
    const remote = (await backend.pull({ cursor: null })).changes.find((c) => c.id === "x");
    expect(remote && isCardDeleted(remote)).toBe(true);
    engine.stop();
  });

  it("is single-flight: overlapping syncs do not double-push", async () => {
    const backend = createMockBackend();
    let pushCount = 0;
    const counting: SyncBackend = {
      ...backend,
      push: async (req) => {
        pushCount++;
        return backend.push(req);
      },
    };
    const engine = makeEngine(counting);
    await engine.start();
    await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    await Promise.all([engine.syncNow(), engine.syncNow(), engine.syncNow()]);
    expect(pushCount).toBe(1);
    expect(await readOutbox()).toEqual([]);
    engine.stop();
  });

  it("does not record mutations after stop()", async () => {
    const backend = createMockBackend();
    const engine = makeEngine(backend);
    await engine.start();
    engine.stop();
    const seq = await engine.recordMutation({ cardId: "x", field: "create", value: item("x") });
    expect(seq).toBe(-1);
    expect(await getAllStoredCards()).toEqual([]);
  });
});

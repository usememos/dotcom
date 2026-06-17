import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import type { SyncBackend } from "./backend";
import { createMockBackend } from "./backend-mock";
import { advanceClock, type Clock, createClock, receiveClock } from "./clock";
import { applyMutationToCard, coalesceOutbox } from "./mutations";
import { isCardDeleted, reconcileCard } from "./reconcile";
import { type Mutation, SCRATCHPAD_FIELD_GROUPS, type StoredCard } from "./types";

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
    const resp =
      pending.length > 0
        ? await this.backend.push({ mutations: pending, cursor: this.cursor })
        : await this.backend.pull({ cursor: this.cursor });
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

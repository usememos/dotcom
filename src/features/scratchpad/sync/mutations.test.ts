import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import type { Clock } from "./clock";
import { applyMutationToCard, coalesceOutbox, createStoredCard, maxFieldClock, mutationWins } from "./mutations";
import type { Mutation, StoredCard } from "./types";

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
    const card: StoredCard = {
      ...createStoredCard(item("x"), clk(1)),
      clocks: { body: clk(1), layout: clk(7), tone: clk(3), attachments: clk(2) },
    };
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

  it("coalesces independently across create, body, and delete for one card", () => {
    const result = coalesceOutbox([
      mut({ seq: 1, field: "create", value: item("x") }),
      mut({ seq: 2, field: "body", value: "a" }),
      mut({ seq: 3, field: "body", value: "b" }),
      mut({ seq: 4, field: "delete", value: null }),
    ]);
    expect(result.map((m) => [m.field, m.seq])).toEqual([
      ["create", 1],
      ["body", 3],
      ["delete", 4],
    ]);
  });

  it("does not coalesce the same field across different cards", () => {
    const result = coalesceOutbox([
      mut({ seq: 1, cardId: "x", field: "body", value: "x1" }),
      mut({ seq: 2, cardId: "y", field: "body", value: "y1" }),
    ]);
    expect(result).toHaveLength(2);
  });
});

describe("applyMutationToCard (field groups)", () => {
  it("applies layout, tone, and attachments with their clocks", () => {
    let card = createStoredCard(item("x"), clk(1));
    card = applyMutationToCard(
      card,
      mut({ field: "layout", value: { x: 7, y: 8, width: 280, height: 180, zIndex: 2 }, clock: clk(2) }),
    ) as StoredCard;
    expect(card.layout.x).toBe(7);
    expect(card.clocks.layout).toEqual(clk(2));
    card = applyMutationToCard(card, mut({ field: "tone", value: "blue", clock: clk(3) })) as StoredCard;
    expect(card.tone).toBe("blue");
    expect(card.clocks.tone).toEqual(clk(3));
    const refs = [{ id: "a", name: "a.png", type: "image/png", size: 1 }];
    card = applyMutationToCard(card, mut({ field: "attachments", value: refs, clock: clk(4) })) as StoredCard;
    expect(card.content.attachments).toEqual(refs);
    expect(card.clocks.attachments).toEqual(clk(4));
  });

  it("ignores a field patch for a card that does not exist", () => {
    expect(applyMutationToCard(null, mut({ field: "body", value: "x", clock: clk(1) }))).toBeNull();
  });
});

describe("mutationWins (delete)", () => {
  it("accepts a delete only when newer than the card's newest stamp", () => {
    const card = createStoredCard(item("x"), clk(10));
    expect(mutationWins(card, mut({ field: "delete", value: null, clock: clk(5) }))).toBe(false);
    expect(mutationWins(card, mut({ field: "delete", value: null, clock: clk(20) }))).toBe(true);
  });
});

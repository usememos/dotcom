import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
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

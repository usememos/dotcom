import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import type { Clock } from "./clock";
import { createStoredCard } from "./mutations";
import { isCardDeleted, reconcileCard } from "./reconcile";
import type { Mutation, StoredCard } from "./types";

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

  it("merges newer remote layout, tone, and attachments fields", () => {
    const local = createStoredCard(item("x"), clk(1, "a"));
    const remote: StoredCard = {
      ...local,
      layout: { x: 99, y: 88, width: 300, height: 300, zIndex: 5 },
      tone: "pink",
      content: { body: "", attachments: [{ id: "a", name: "a.png", type: "image/png", size: 1, hash: "h" }] },
      clocks: { body: clk(1, "a"), layout: clk(9, "b"), tone: clk(9, "b"), attachments: clk(9, "b") },
    };
    const result = reconcileCard({ local, remote, pending: [] });
    expect(result.layout.x).toBe(99);
    expect(result.tone).toBe("pink");
    expect(result.content.attachments).toHaveLength(1);
  });

  it("merges per field: takes the remote-newer field but keeps the local-newer one", () => {
    const local: StoredCard = {
      ...withBody(createStoredCard(item("x"), clk(1, "a")), "local body", clk(20, "a")),
    };
    const remote: StoredCard = {
      ...withBody(createStoredCard(item("x"), clk(1, "a")), "remote body", clk(5, "b")),
      layout: { x: 50, y: 0, width: 280, height: 180, zIndex: 1 },
      clocks: { body: clk(5, "b"), layout: clk(9, "b"), tone: clk(1, "a"), attachments: clk(1, "a") },
    };
    const result = reconcileCard({ local, remote, pending: [] });
    expect(result.content.body).toBe("local body"); // local body clock 20 beats remote 5
    expect(result.layout.x).toBe(50); // remote layout clock 9 beats local 1
  });

  it("resolves concurrent tombstones by last-write-wins on deletedClock", () => {
    const local: StoredCard = { ...createStoredCard(item("x"), clk(1, "a")), deletedAt: 10, deletedClock: clk(10, "a") };
    const remote: StoredCard = { ...createStoredCard(item("x"), clk(1, "a")), deletedAt: 20, deletedClock: clk(20, "b") };
    const result = reconcileCard({ local, remote, pending: [] });
    expect(result.deletedClock).toEqual(clk(20, "b"));
    expect(isCardDeleted(result)).toBe(true);
  });
});

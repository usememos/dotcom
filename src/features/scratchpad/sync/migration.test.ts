import { describe, expect, it } from "vitest";
import { itemStorage } from "../lib/storage";
import type { ScratchpadItem, ScratchpadViewport } from "../types";
import { runScratchpadMigration } from "./migration";
import { getAllStoredCards, getMeta, readOutbox } from "./store";

const clock = (() => {
  let t = 1;
  return () => t++;
})();

function seedItem(): void {
  const item: ScratchpadItem = {
    id: "x",
    layout: { x: 0, y: 0, width: 320, height: 300, zIndex: 1 },
    content: { body: "hi", attachments: [] },
    timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
  };
  itemStorage.save([item]);
}

describe("runScratchpadMigration", () => {
  it("moves localStorage items into the cards store and records meta", async () => {
    seedItem();
    await runScratchpadMigration("dev-a", clock);
    const cards = await getAllStoredCards();
    expect(cards.map((c) => c.id)).toEqual(["x"]);
    expect(cards[0].dirty).toBe(true);
    expect(cards[0].content.body).toBe("hi");
    const outbox = await readOutbox();
    expect(outbox).toHaveLength(1);
    expect(outbox[0]).toMatchObject({ cardId: "x", field: "create" });
    expect(await getMeta<boolean>("migratedV2")).toBe(true);
    expect(await getMeta<ScratchpadViewport>("viewport")).not.toBeNull();
    expect(localStorage.getItem("memos-scratch-items")).toBeNull();
  });

  it("is a no-op on a second run", async () => {
    seedItem();
    await runScratchpadMigration("dev-a", clock);
    await runScratchpadMigration("dev-a", clock);
    expect((await getAllStoredCards()).length).toBe(1);
  });

  it("migrates multiple items and preserves attachment refs, one create per item", async () => {
    const make = (id: string, attachments: ScratchpadItem["content"]["attachments"] = []): ScratchpadItem => ({
      id,
      layout: { x: 0, y: 0, width: 320, height: 300, zIndex: 1 },
      content: { body: id, attachments },
      timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
    });
    itemStorage.save([make("x", [{ id: "f1", name: "f1.png", type: "image/png", size: 3 }]), make("y")]);
    await runScratchpadMigration("dev-a", clock);
    const cards = await getAllStoredCards();
    expect(cards.map((c) => c.id).sort()).toEqual(["x", "y"]);
    expect(cards.find((c) => c.id === "x")?.content.attachments).toHaveLength(1);
    expect((await readOutbox()).map((m) => m.field)).toEqual(["create", "create"]);
  });

  it("still records the migrated flag when there are no legacy items", async () => {
    await runScratchpadMigration("dev-a", clock);
    expect(await getMeta<boolean>("migratedV2")).toBe(true);
    expect(await getAllStoredCards()).toEqual([]);
    expect(await readOutbox()).toEqual([]);
  });
});

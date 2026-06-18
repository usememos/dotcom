import { describe, expect, it } from "vitest";
import { settingsStorage } from "../lib/storage";
import type { ScratchpadItem } from "../types";
import { loadDocument, migrateScratchpadStorage, saveDocument } from "./document";

const makeItem = (id: string, body = id): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 320, height: 300, zIndex: 1 },
  content: { body, attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

// Seed a `cards` store the way the removed sync engine would have. A fresh
// fake-indexeddb means this open creates the DB and runs onupgradeneeded.
function seedLegacyCards(cards: Array<ScratchpadItem & { deletedAt?: number | null }>): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("memos-scratch", 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("files", { keyPath: "id" });
      db.createObjectStore("blobs", { keyPath: "hash" });
      db.createObjectStore("cards", { keyPath: "id" });
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(["cards"], "readwrite");
      for (const card of cards) tx.objectStore("cards").put(card);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

describe("loadDocument / saveDocument", () => {
  it("round-trips a document through localStorage", () => {
    saveDocument({ items: [makeItem("a"), makeItem("b")] });
    expect(
      loadDocument()
        .items.map((i) => i.id)
        .sort(),
    ).toEqual(["a", "b"]);
  });

  it("loads an empty document when nothing is stored", () => {
    expect(loadDocument().items).toEqual([]);
  });
});

describe("migrateScratchpadStorage", () => {
  it("is a no-op and records the flag for a fresh install", async () => {
    await migrateScratchpadStorage();
    expect(loadDocument().items).toEqual([]);
    expect(settingsStorage.getSetting("migrated-local-v1", false)).toBe(true);
  });

  it("seeds the document from legacy cards, dropping tombstoned ones", async () => {
    await seedLegacyCards([makeItem("live"), { ...makeItem("dead"), deletedAt: 123 }]);
    await migrateScratchpadStorage();
    expect(loadDocument().items.map((i) => i.id)).toEqual(["live"]);
  });

  it("never clobbers an existing localStorage document", async () => {
    saveDocument({ items: [makeItem("local")] });
    await seedLegacyCards([makeItem("legacy")]);
    await migrateScratchpadStorage();
    expect(loadDocument().items.map((i) => i.id)).toEqual(["local"]);
  });

  it("is idempotent across runs", async () => {
    await seedLegacyCards([makeItem("once")]);
    await migrateScratchpadStorage();
    saveDocument({ items: [] }); // simulate the user later clearing the board
    await migrateScratchpadStorage(); // must not re-seed
    expect(loadDocument().items).toEqual([]);
  });
});

import { itemStorage, settingsStorage } from "../lib/storage";
import type { ScratchpadDocument, ScratchpadItem } from "../types";
import { openScratchpadDB } from "./db";

const MIGRATION_FLAG = "migrated-local-v1";

/** The scratchpad document lives as one JSON record in localStorage. */
export function loadDocument(): ScratchpadDocument {
  return { items: itemStorage.getAll() };
}

export function saveDocument(document: ScratchpadDocument): void {
  itemStorage.save(document.items);
}

/** A card left behind by the removed sync engine. Only the fields we still need. */
interface LegacyStoredCard extends ScratchpadItem {
  deletedAt?: number | null;
}

/**
 * Read cards left behind by the removed sync engine, if the `cards` store still
 * exists. Returns [] on a fresh install (no `cards` store), so migration is a
 * no-op for new users.
 */
async function readLegacyStoredCards(): Promise<LegacyStoredCard[]> {
  const db = await openScratchpadDB();
  try {
    if (!db.objectStoreNames.contains("cards")) return [];
    return await new Promise<LegacyStoredCard[]>((resolve, reject) => {
      const tx = db.transaction(["cards"], "readonly");
      const request = tx.objectStore("cards").getAll();
      request.onsuccess = () => resolve((request.result as LegacyStoredCard[]) ?? []);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

/**
 * One-time, idempotent. If a previous build wrote cards into the IndexedDB
 * `cards` store (the removed sync engine), fold them into the localStorage
 * document — but never overwrite an existing localStorage document, since that
 * holds the user's newer local edits. The flag lives in localStorage alongside
 * the data it guards.
 */
export async function migrateScratchpadStorage(): Promise<void> {
  if (settingsStorage.getSetting(MIGRATION_FLAG, false)) return;

  if (itemStorage.getAll().length === 0) {
    const legacy = await readLegacyStoredCards();
    const items = legacy
      .filter((card) => card.deletedAt == null)
      .map((card) => ({
        id: card.id,
        layout: card.layout,
        content: card.content,
        timestamps: card.timestamps,
        ...(card.tone ? { tone: card.tone } : {}),
      }));
    if (items.length > 0) itemStorage.save(items);
  }

  settingsStorage.setSetting(MIGRATION_FLAG, true);
}

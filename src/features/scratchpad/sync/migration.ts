import { itemStorage, viewportStorage } from "../lib/storage";
import type { ScratchpadViewport } from "../types";
import { createClock } from "./clock";
import { createStoredCard } from "./mutations";
import { commitLocalMutation, getMeta, setMeta } from "./store";
import type { MutationDraft } from "./types";

const MIGRATION_FLAG = "migratedV2";
const LEGACY_ITEMS_KEY = "memos-scratch-items";

/**
 * One-time move from the old localStorage layout to the unified IndexedDB store.
 * Each item becomes a dirty card AND a `create` mutation in the outbox, so it
 * flows up on the first sync (the engine pushes when the outbox is non-empty —
 * `dirty` alone would never sync). The device-local viewport relocates into
 * `meta`. Legacy id-keyed blobs in the `files` store are
 * left in place — the attachment preview hook still serves them by id, and new
 * uploads are content-addressed. (Re-keying legacy blobs is deferred to the
 * backend spec.)
 */
export async function runScratchpadMigration(deviceId: string, now: () => number = () => Date.now()): Promise<void> {
  if (await getMeta<boolean>(MIGRATION_FLAG)) return;

  const clock0 = createClock(deviceId, now(), 0);
  for (const item of itemStorage.getAll()) {
    const draft: MutationDraft = { cardId: item.id, field: "create", value: item, clock: clock0 };
    await commitLocalMutation(createStoredCard(item, clock0), draft);
  }

  await setMeta<ScratchpadViewport>("viewport", viewportStorage.get());
  await setMeta(MIGRATION_FLAG, true);

  if (typeof localStorage !== "undefined") localStorage.removeItem(LEGACY_ITEMS_KEY);
}

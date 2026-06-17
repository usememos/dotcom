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

/**
 * Run one transaction against the unified DB and resolve with the result of the
 * request returned by `op` (or undefined for write-only ops). Centralizes the
 * open → transaction → close + error wiring shared by every accessor here and
 * in blobs.ts.
 */
export function runScratchpadTx<T>(
  stores: string[],
  mode: IDBTransactionMode,
  op: (tx: IDBTransaction) => IDBRequest | undefined,
): Promise<T> {
  return openScratchpadDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(stores, mode);
        let request: IDBRequest | undefined;
        try {
          request = op(tx);
        } catch (error) {
          reject(error);
          return;
        }
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
        tx.oncomplete = () => {
          db.close();
          resolve(request?.result as T);
        };
      }),
  );
}

export async function getAllStoredCards(): Promise<StoredCard[]> {
  return (await runScratchpadTx<StoredCard[]>(["cards"], "readonly", (tx) => tx.objectStore("cards").getAll())) ?? [];
}

export async function getStoredCard(id: string): Promise<StoredCard | null> {
  return (await runScratchpadTx<StoredCard | undefined>(["cards"], "readonly", (tx) => tx.objectStore("cards").get(id))) ?? null;
}

export async function putStoredCard(card: StoredCard): Promise<void> {
  await runScratchpadTx(["cards"], "readwrite", (tx) => tx.objectStore("cards").put(card));
}

export async function readOutbox(): Promise<Mutation[]> {
  const entries = (await runScratchpadTx<Mutation[]>(["outbox"], "readonly", (tx) => tx.objectStore("outbox").getAll())) ?? [];
  return entries.sort((a, b) => a.seq - b.seq);
}

export async function appendOutbox(draft: MutationDraft): Promise<number> {
  return runScratchpadTx<number>(["outbox"], "readwrite", (tx) => tx.objectStore("outbox").add(draft as Mutation));
}

export async function ackOutbox(seqs: number[]): Promise<void> {
  if (seqs.length === 0) return;
  await runScratchpadTx(["outbox"], "readwrite", (tx) => {
    const store = tx.objectStore("outbox");
    for (const seq of seqs) store.delete(seq);
    return undefined;
  });
}

export async function commitLocalMutation(card: StoredCard, draft: MutationDraft): Promise<number> {
  return runScratchpadTx<number>(["cards", "outbox"], "readwrite", (tx) => {
    tx.objectStore("cards").put(card);
    return tx.objectStore("outbox").add(draft as Mutation);
  });
}

export async function getMeta<T>(key: string): Promise<T | null> {
  const record = await runScratchpadTx<{ value: T } | undefined>(["meta"], "readonly", (tx) => tx.objectStore("meta").get(key));
  return record ? record.value : null;
}

export async function setMeta<T>(key: string, value: T): Promise<void> {
  await runScratchpadTx(["meta"], "readwrite", (tx) => tx.objectStore("meta").put({ key, value }));
}

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
      if (!db.objectStoreNames.contains("blobs")) db.createObjectStore("blobs", { keyPath: "hash" });
    };
  });
}

/**
 * Run one transaction against the unified DB and resolve with the result of the
 * request returned by `op` (or undefined for write-only ops). Centralizes the
 * open → transaction → close + error wiring shared by the blob accessors in
 * blobs.ts.
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

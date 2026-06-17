import type { ScratchpadAttachmentRef } from "../types";
import type { SyncBackend } from "./backend";
import { runScratchpadTx } from "./store";

export interface StoredBlob {
  hash: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
}

/**
 * What we actually persist. Raw bytes (ArrayBuffer) round-trip cleanly through
 * structured clone in every environment; a stored Blob does not survive
 * fake-indexeddb's clone in tests. We reconstruct the Blob on read.
 */
interface StoredBlobRecord {
  hash: string;
  name: string;
  type: string;
  size: number;
  bytes: ArrayBuffer;
}

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === "function") return blob.arrayBuffer();
  // Fallback for environments whose Blob lacks arrayBuffer() (e.g. jsdom in tests).
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

export async function hashBlob(blob: Blob): Promise<string> {
  const buffer = await blobToArrayBuffer(blob);
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function recordToStoredBlob(record: StoredBlobRecord): StoredBlob {
  return {
    hash: record.hash,
    name: record.name,
    type: record.type,
    size: record.size,
    blob: new Blob([record.bytes], { type: record.type }),
  };
}

export async function putLocalBlob(input: StoredBlob): Promise<void> {
  const bytes = await blobToArrayBuffer(input.blob);
  const record: StoredBlobRecord = { hash: input.hash, name: input.name, type: input.type, size: input.size, bytes };
  await runScratchpadTx(["blobs"], "readwrite", (tx) => tx.objectStore("blobs").put(record));
}

export async function getLocalBlob(hash: string): Promise<StoredBlob | null> {
  const record = await runScratchpadTx<StoredBlobRecord | undefined>(["blobs"], "readonly", (tx) => tx.objectStore("blobs").get(hash));
  return record ? recordToStoredBlob(record) : null;
}

export async function hasLocalBlob(hash: string): Promise<boolean> {
  return (await runScratchpadTx<number>(["blobs"], "readonly", (tx) => tx.objectStore("blobs").count(hash))) > 0;
}

export async function deleteLocalBlob(hash: string): Promise<void> {
  await runScratchpadTx(["blobs"], "readwrite", (tx) => tx.objectStore("blobs").delete(hash));
}

export async function allLocalBlobHashes(): Promise<string[]> {
  return (await runScratchpadTx<string[]>(["blobs"], "readonly", (tx) => tx.objectStore("blobs").getAllKeys())) ?? [];
}

export async function uploadMissingBlobs(backend: SyncBackend, refs: ScratchpadAttachmentRef[]): Promise<void> {
  const seen = new Set<string>();
  for (const ref of refs) {
    if (!ref.hash || seen.has(ref.hash)) continue;
    seen.add(ref.hash);
    if (await backend.hasBlob(ref.hash)) continue;
    const local = await getLocalBlob(ref.hash);
    if (local) await backend.putBlob(ref.hash, local.blob);
  }
}

export async function loadAttachmentBlob(backend: SyncBackend, ref: ScratchpadAttachmentRef): Promise<Blob | null> {
  if (!ref.hash) return null;
  const local = await getLocalBlob(ref.hash);
  if (local) return local.blob;
  try {
    const blob = await backend.getBlob(ref.hash);
    await putLocalBlob({ hash: ref.hash, name: ref.name, type: ref.type, size: ref.size, blob });
    return blob;
  } catch {
    return null;
  }
}

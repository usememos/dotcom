import { describe, expect, it } from "vitest";
import type { ScratchpadAttachmentRef, ScratchpadItem } from "../types";
import { createMockBackend } from "./backend-mock";
import { getLocalBlob, hashBlob, loadAttachmentBlob, putLocalBlob, uploadMissingBlobs } from "./blobs";
import { createSyncEngine } from "./engine";

async function seedLocalBlob(text: string): Promise<ScratchpadAttachmentRef> {
  const blob = new Blob([text]);
  const hash = await hashBlob(blob);
  await putLocalBlob({ hash, name: `${text}.txt`, type: "text/plain", size: blob.size, blob });
  return { id: `id-${text}`, name: `${text}.txt`, type: "text/plain", size: blob.size, hash };
}

describe("uploadMissingBlobs", () => {
  it("uploads a referenced blob the backend does not yet have", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    await uploadMissingBlobs(backend, [ref]);
    expect(await backend.hasBlob(ref.hash as string)).toBe(true);
  });

  it("skips blobs the backend already has and ignores refs without a hash", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    await backend.putBlob(ref.hash as string, new Blob(["pic"]));
    await uploadMissingBlobs(backend, [ref, { id: "legacy", name: "l", type: "text/plain", size: 1 }]);
    expect(await backend.hasBlob(ref.hash as string)).toBe(true);
  });
});

describe("loadAttachmentBlob", () => {
  it("returns the local blob without touching the backend", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    const blob = await loadAttachmentBlob(backend, ref);
    expect(blob).not.toBeNull();
    expect(await hashBlob(blob as Blob)).toBe(ref.hash);
  });

  it("downloads from the backend on a local miss and caches it", async () => {
    const backend = createMockBackend();
    const blob = new Blob(["remote"]);
    const hash = await hashBlob(blob);
    await backend.putBlob(hash, blob);
    const ref: ScratchpadAttachmentRef = { id: "r", name: "r.txt", type: "text/plain", size: blob.size, hash };
    const loaded = await loadAttachmentBlob(backend, ref);
    expect(loaded).not.toBeNull();
    expect(await hashBlob(loaded as Blob)).toBe(hash);
    expect(await getLocalBlob(hash)).not.toBeNull();
  });
});

describe("engine uploads referenced blobs before pushing", () => {
  it("makes attachment bytes available on the backend after sync", async () => {
    const backend = createMockBackend();
    const ref = await seedLocalBlob("pic");
    const engine = createSyncEngine({
      backend,
      deviceId: "dev-a",
      now: (() => {
        let t = 1;
        return () => t++;
      })(),
      debounceMs: 1_000_000, // explicit syncNow() only; avoid a background debounce-sync race
    });
    await engine.start();
    const card: ScratchpadItem = {
      id: "x",
      layout: { x: 0, y: 0, width: 320, height: 300, zIndex: 1 },
      content: { body: "", attachments: [ref] },
      timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
    };
    await engine.recordMutation({ cardId: "x", field: "create", value: card });
    await engine.syncNow();
    expect(await backend.hasBlob(ref.hash as string)).toBe(true);
    engine.stop();
  });
});

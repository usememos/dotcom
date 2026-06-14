import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FileData } from "../types";
import { clearAllFiles, createFileData, deleteFile, deleteOldFiles, getAllFiles, getFile, getTotalFileSize, saveFile } from "./indexeddb";

const makeFile = (id: string, size = 4, uploadedAt = new Date("2026-06-14T00:00:00Z")): FileData => ({
  id,
  name: `${id}.txt`,
  type: "text/plain",
  size,
  blob: new Blob(["data"]),
  uploadedAt,
});

describe("indexeddb CRUD", () => {
  it("saves and reads a file back, rehydrating uploadedAt as a Date", async () => {
    await saveFile(makeFile("a"));
    const loaded = await getFile("a");
    expect(loaded?.id).toBe("a");
    expect(loaded?.uploadedAt).toBeInstanceOf(Date);
  });

  it("returns null for a missing file", async () => {
    expect(await getFile("nope")).toBeNull();
  });

  it("lists all files and totals their sizes", async () => {
    await saveFile(makeFile("a", 10));
    await saveFile(makeFile("b", 25));
    expect((await getAllFiles()).map((f) => f.id).sort()).toEqual(["a", "b"]);
    expect(await getTotalFileSize()).toBe(35);
  });

  it("deletes a single file and clears all", async () => {
    await saveFile(makeFile("a"));
    await saveFile(makeFile("b"));
    await deleteFile("a");
    expect(await getFile("a")).toBeNull();
    await clearAllFiles();
    expect(await getAllFiles()).toEqual([]);
  });
});

describe("deleteOldFiles", () => {
  it("removes files older than the cutoff and returns the count", async () => {
    await saveFile(makeFile("old", 1, new Date("2020-01-01T00:00:00Z")));
    await saveFile(makeFile("new", 1, new Date()));
    const deleted = await deleteOldFiles(30);
    expect(deleted).toBe(1);
    expect(await getFile("old")).toBeNull();
    expect(await getFile("new")).not.toBeNull();
  });
});

describe("createFileData", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-14T00:00:00Z"));
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("builds a FileData with a deterministic id and copied metadata", () => {
    const file = new File(["hello"], "greeting.txt", { type: "text/plain" });
    const data = createFileData(file);
    expect(data.name).toBe("greeting.txt");
    expect(data.type).toBe("text/plain");
    expect(data.size).toBe(file.size);
    expect(data.uploadedAt).toBeInstanceOf(Date);
    expect(data.id).toMatch(/^file-\d+-[a-z0-9]+$/);
  });

  it("falls back to a default name for a nameless Blob", () => {
    const data = createFileData(new Blob(["x"], { type: "" }));
    expect(data.name).toBe("untitled");
    expect(data.type).toBe("application/octet-stream");
  });
});

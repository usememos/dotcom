import { describe, expect, it } from "vitest";
import { allLocalBlobHashes, deleteLocalBlob, getLocalBlob, hashBlob, hasLocalBlob, putLocalBlob } from "./blobs";

const SHA256_ABC = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";

describe("hashBlob", () => {
  it("computes a stable SHA-256 hex digest", async () => {
    expect(await hashBlob(new Blob(["abc"]))).toBe(SHA256_ABC);
  });

  it("gives identical bytes the same hash", async () => {
    expect(await hashBlob(new Blob(["same"]))).toBe(await hashBlob(new Blob(["same"])));
  });
});

describe("local blob store", () => {
  const make = async (text: string) => {
    const blob = new Blob([text]);
    return { hash: await hashBlob(blob), name: `${text}.txt`, type: "text/plain", size: blob.size, blob };
  };

  it("puts, gets, checks existence, lists, and deletes by hash", async () => {
    const rec = await make("hello");
    await putLocalBlob(rec);
    expect((await getLocalBlob(rec.hash))?.name).toBe("hello.txt");
    expect(await hasLocalBlob(rec.hash)).toBe(true);
    expect(await hasLocalBlob("missing")).toBe(false);
    expect(await allLocalBlobHashes()).toEqual([rec.hash]);
    await deleteLocalBlob(rec.hash);
    expect(await getLocalBlob(rec.hash)).toBeNull();
  });

  it("dedupes identical content under one key", async () => {
    const a = await make("dupe");
    const b = await make("dupe");
    await putLocalBlob(a);
    await putLocalBlob(b);
    expect((await allLocalBlobHashes()).length).toBe(1);
  });
});

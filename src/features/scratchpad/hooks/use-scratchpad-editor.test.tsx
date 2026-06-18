import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { itemStorage } from "../lib/storage";
import { getLocalBlob } from "../persistence/blobs";
import { loadDocument } from "../persistence/document";
import { useScratchpadEditor } from "./use-scratchpad-editor";

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  vi.useRealTimers();
});

async function mountReady() {
  const hook = renderHook(() => useScratchpadEditor());
  await waitFor(() => expect(hook.result.current.isClient).toBe(true));
  return hook;
}

function makeFileList(...files: File[]): FileList {
  const indexed: Record<number, File> = {};
  files.forEach((f, i) => {
    indexed[i] = f;
  });
  return {
    length: files.length,
    item: (i: number) => files[i] ?? null,
    [Symbol.iterator]: () => files[Symbol.iterator](),
    ...indexed,
  } as unknown as FileList;
}

describe("useScratchpadEditor", () => {
  it("becomes client-ready and starts empty", async () => {
    const { result } = await mountReady();
    expect(result.current.items).toEqual([]);
    expect(result.current.viewport).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it("creates a text item and persists it to the document", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(100, 100));

    expect(result.current.items).toHaveLength(1);
    await waitFor(() => expect(loadDocument().items).toHaveLength(1));
  });

  it("updates an item body", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;

    act(() => result.current.updateItemBody(id, "typed text"));
    expect(result.current.items[0].content.body).toBe("typed text");
  });

  it("selects and clears selection", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;

    act(() => result.current.selectItem(id));
    expect(result.current.selectedItemIds).toEqual([id]);
    act(() => result.current.selectItem(null));
    expect(result.current.selectedItemIds).toEqual([]);
  });

  it("deletes an item", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;

    act(() => result.current.deleteItem(id));
    expect(result.current.items).toEqual([]);
  });

  it("uploads a file into a new item with an attachment", async () => {
    const { result } = await mountReady();
    const files = makeFileList(new File(["data"], "pic.png", { type: "image/png" }));

    await act(async () => {
      await result.current.uploadFiles(files, 50, 50);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].content.attachments).toHaveLength(1);
    expect(result.current.items[0].content.attachments[0].name).toBe("pic.png");
  });

  it("persists a layout update to the document", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;

    act(() => result.current.updateItemLayout(id, { x: 123 }));
    expect(result.current.items[0].layout.x).toBe(123);
    await waitFor(() => {
      const item = loadDocument().items.find((i) => i.id === id);
      expect(item?.layout.x).toBe(123);
    });
  });

  it("content-addresses an uploaded file in the blob store", async () => {
    const { result } = await mountReady();
    const files = makeFileList(new File(["pic-bytes"], "p.png", { type: "image/png" }));

    await act(async () => {
      await result.current.uploadFiles(files, 0, 0);
    });

    const ref = result.current.items[0].content.attachments[0];
    expect(ref.hash).toBeTruthy();
    expect(await getLocalBlob(ref.hash as string)).not.toBeNull();
  });

  it("hydrates an existing document on mount", async () => {
    itemStorage.save([
      {
        id: "seed",
        layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
        content: { body: "from storage", attachments: [] },
        timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
      },
    ]);

    const { result } = await mountReady();
    expect(result.current.items.map((i) => i.id)).toContain("seed");
    expect(result.current.items.find((i) => i.id === "seed")?.content.body).toBe("from storage");
  });
});

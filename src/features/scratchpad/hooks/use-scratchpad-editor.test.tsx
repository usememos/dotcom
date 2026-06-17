import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLocalBlob } from "../sync/blobs";
import { createStoredCard } from "../sync/mutations";
import { getAllStoredCards, putStoredCard } from "../sync/store";
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

  it("creates a text item and persists it to the store", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(100, 100));

    expect(result.current.items).toHaveLength(1);
    await waitFor(async () => expect((await getAllStoredCards()).length).toBe(1));
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

    await act(async () => {
      await result.current.deleteItem(id);
    });
    expect(result.current.items).toEqual([]);
  });

  it("uploads a file into a new item with an attachment", async () => {
    const { result } = await mountReady();
    const files = {
      length: 1,
      0: new File(["data"], "pic.png", { type: "image/png" }),
      item(i: number) {
        return this[i as 0];
      },
      [Symbol.iterator]() {
        return [this[0]][Symbol.iterator]();
      },
    } as unknown as FileList;

    await act(async () => {
      await result.current.uploadFiles(files, 50, 50);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].content.attachments).toHaveLength(1);
    expect(result.current.items[0].content.attachments[0].name).toBe("pic.png");
  });

  it("persists a layout update to the store", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(0, 0));
    const id = result.current.items[0].id;
    // Let the create persist before editing — a field patch can only land on a
    // card already in the store.
    await waitFor(async () => expect((await getAllStoredCards()).some((c) => c.id === id)).toBe(true));

    act(() => result.current.updateItemLayout(id, { x: 123 }));
    expect(result.current.items[0].layout.x).toBe(123);
    await waitFor(async () => {
      const card = (await getAllStoredCards()).find((c) => c.id === id);
      expect(card?.layout.x).toBe(123);
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

  it("hydrates existing cards from the store on mount", async () => {
    const seed = createStoredCard(
      {
        id: "seed",
        layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
        content: { body: "from store", attachments: [] },
        timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
      },
      { ts: 1, counter: 0, deviceId: "d" },
    );
    await putStoredCard(seed);

    const { result } = await mountReady();
    expect(result.current.items.map((i) => i.id)).toContain("seed");
    expect(result.current.items.find((i) => i.id === "seed")?.content.body).toBe("from store");
  });
});

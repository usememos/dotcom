import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { itemStorage } from "../lib/storage";
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

describe("useScratchpadEditor", () => {
  it("becomes client-ready and starts empty", async () => {
    const { result } = await mountReady();
    expect(result.current.items).toEqual([]);
    expect(result.current.viewport).toEqual({ x: 0, y: 0, scale: 1 });
  });

  it("creates a text item and persists it immediately", async () => {
    const { result } = await mountReady();
    act(() => result.current.createTextItem(100, 100));

    expect(result.current.items).toHaveLength(1);
    expect(itemStorage.getAll()).toHaveLength(1); // immediate persistence
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
});

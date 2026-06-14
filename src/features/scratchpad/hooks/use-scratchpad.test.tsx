import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const editor = {
  createTextItem: vi.fn(),
  deleteItem: vi.fn(),
  deleteItems: vi.fn().mockResolvedValue(undefined),
  uploadFiles: vi.fn(),
  removeAttachment: vi.fn(),
  selectItem: vi.fn(),
  updateItemBody: vi.fn(),
  updateItemLayout: vi.fn(),
  setViewport: vi.fn(),
  isClient: true,
  items: [],
  lastActiveItemId: null,
  selectedItemIds: [] as string[],
  viewport: { x: 0, y: 0, scale: 1 },
};
vi.mock("./use-scratchpad-editor", () => ({ useScratchpadEditor: () => editor }));

import { useScratchpad } from "./use-scratchpad";

beforeEach(() => {
  vi.clearAllMocks();
  editor.selectedItemIds = [];
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("useScratchpad", () => {
  it("maps editor methods onto the handler surface", () => {
    const { result } = renderHook(() => useScratchpad());
    result.current.handleCreateTextItem(1, 2);
    expect(editor.createTextItem).toHaveBeenCalledWith(1, 2);
    expect(result.current.viewport).toBe(editor.viewport);
  });

  it("does nothing on delete-selected when nothing is selected", async () => {
    const { result } = renderHook(() => useScratchpad());
    await result.current.handleDeleteSelected();
    expect(editor.deleteItems).not.toHaveBeenCalled();
  });

  it("confirms before deleting the selection", async () => {
    editor.selectedItemIds = ["a", "b"];
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const { result } = renderHook(() => useScratchpad());

    await result.current.handleDeleteSelected();
    expect(confirmSpy).toHaveBeenCalledWith("Delete 2 selected items?");
    expect(editor.deleteItems).toHaveBeenCalledWith(["a", "b"]);
  });

  it("aborts the delete when the user cancels the confirm", async () => {
    editor.selectedItemIds = ["a"];
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => useScratchpad());

    await result.current.handleDeleteSelected();
    expect(editor.deleteItems).not.toHaveBeenCalled();
  });
});

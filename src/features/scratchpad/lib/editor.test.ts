import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import {
  createScratchpadEditorState,
  getNextScratchpadZIndex,
  getScratchpadItem,
  getSelectedScratchpadItems,
  type ScratchpadEditorOperation,
  scratchpadEditorReducer,
} from "./editor";

const makeItem = (id: string, zIndex = 1): ScratchpadItem => ({
  id,
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
});

function run(
  state = createScratchpadEditorState(),
  operations: ScratchpadEditorOperation[],
  persistence: "immediate" | "debounced" | "none" = "immediate",
) {
  return scratchpadEditorReducer(state, { type: "run-transaction", id: 1, reason: "test", persistence, operations });
}

describe("selectors", () => {
  it("getNextScratchpadZIndex returns 1 for empty and max+1 otherwise", () => {
    expect(getNextScratchpadZIndex([])).toBe(1);
    expect(getNextScratchpadZIndex([makeItem("a", 2), makeItem("b", 5)])).toBe(6);
  });

  it("getScratchpadItem / getSelectedScratchpadItems filter by id", () => {
    const items = [makeItem("a"), makeItem("b")];
    expect(getScratchpadItem(items, "b")?.id).toBe("b");
    expect(getSelectedScratchpadItems({ document: { items }, selectedItemIds: ["b"] }).map((i) => i.id)).toEqual(["b"]);
  });
});

describe("scratchpadEditorReducer", () => {
  it("hydrates and normalizes items", () => {
    const state = scratchpadEditorReducer(createScratchpadEditorState(), {
      type: "hydrate",
      items: [makeItem("a")],
      viewport: { x: 1, y: 2, scale: 1 },
    });
    expect(state.document.items).toHaveLength(1);
    expect(state.viewport).toEqual({ x: 1, y: 2, scale: 1 });
  });

  it("adds an item and records lastActiveItemId + transaction", () => {
    const next = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    expect(next.document.items.map((i) => i.id)).toEqual(["a"]);
    expect(next.lastActiveItemId).toBe("a");
    expect(next.lastTransaction).toMatchObject({ persistence: "immediate", changes: { items: true } });
  });

  it("patches an item", () => {
    const start = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    const next = run(start, [{ type: "patch-item", id: "a", patch: { content: { body: "hello" } } }]);
    expect(getScratchpadItem(next.document.items, "a")?.content.body).toBe("hello");
  });

  it("deletes items and prunes selection + lastActive", () => {
    let s = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    s = run(s, [{ type: "select-item", id: "a", additive: false }]);
    s = run(s, [{ type: "delete-items", ids: ["a"] }]);
    expect(s.document.items).toHaveLength(0);
    expect(s.selectedItemIds).toEqual([]);
    expect(s.lastActiveItemId).toBeNull();
  });

  it("selects (toggle additive) and brings the item to front", () => {
    let s = run(undefined, [{ type: "add-item", item: makeItem("a", 1) }]);
    s = run(s, [{ type: "add-item", item: makeItem("b", 2) }]);
    s = run(s, [{ type: "select-item", id: "a", additive: false }]);
    expect(getScratchpadItem(s.document.items, "a")?.layout.zIndex).toBe(3); // brought to front
    s = run(s, [{ type: "select-item", id: "b", additive: true }]);
    expect(s.selectedItemIds).toEqual(["a", "b"]);
    s = run(s, [{ type: "select-item", id: "b", additive: true }]); // toggles off
    expect(s.selectedItemIds).toEqual(["a"]);
  });

  it("clear-selection empties the selection", () => {
    let s = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    s = run(s, [{ type: "select-item", id: "a", additive: false }]);
    s = run(s, [{ type: "clear-selection" }], "none");
    expect(s.selectedItemIds).toEqual([]);
  });

  it("returns the same state reference for an empty (no-op) transaction", () => {
    const start = run(undefined, [{ type: "add-item", item: makeItem("a") }]);
    const next = scratchpadEditorReducer(start, {
      type: "run-transaction",
      id: 2,
      reason: "noop",
      persistence: "none",
      operations: [],
    });
    expect(next).toBe(start);
  });
});

describe("merge-cards", () => {
  const hydrated = () =>
    scratchpadEditorReducer(createScratchpadEditorState(), {
      type: "hydrate",
      items: [makeItem("a"), makeItem("b")],
      viewport: { x: 0, y: 0, scale: 1 },
    });

  it("upserts new and existing cards and removes deleted ones", () => {
    const updatedA: ScratchpadItem = { ...makeItem("a"), content: { body: "new", attachments: [] } };
    const next = scratchpadEditorReducer(hydrated(), {
      type: "merge-cards",
      upserts: [updatedA, makeItem("c")],
      removedIds: ["b"],
    });
    expect(next.document.items.map((i) => i.id).sort()).toEqual(["a", "c"]);
    expect(getScratchpadItem(next.document.items, "a")?.content.body).toBe("new");
    expect(next.lastTransaction).toBeNull();
  });

  it("clears selection and lastActive for removed cards", () => {
    const selected = run(hydrated(), [{ type: "select-item", id: "a", additive: false }]);
    const next = scratchpadEditorReducer(selected, { type: "merge-cards", upserts: [], removedIds: ["a"] });
    expect(next.selectedItemIds).toEqual([]);
    expect(next.lastActiveItemId).toBeNull();
  });
});

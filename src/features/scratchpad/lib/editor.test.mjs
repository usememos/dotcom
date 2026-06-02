import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        return nextResolve(specifier, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const { createScratchpadEditorState, createScratchpadItem, getSelectedScratchpadItems, scratchpadEditorReducer } = await import(
  "./editor.ts"
);

test("editor reducer stores items under document", () => {
  const item = createScratchpadItem(12, 24, 1);
  const state = scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "run-transaction",
    id: 1,
    reason: "item.create",
    persistence: "immediate",
    operations: [{ type: "add-item", item }],
  });

  assert.deepEqual(state.document.items, [item]);
  assert.equal(state.lastActiveItemId, item.id);
  assert.equal(state.lastTransaction?.changes.items, true);
});

test("editor reducer tracks the last active selected item", () => {
  const first = createScratchpadItem(0, 0, 1);
  const second = createScratchpadItem(10, 10, 2);
  const initial = scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "hydrate",
    items: [first, second],
    viewport: { x: 0, y: 0, scale: 1 },
  });

  const selected = scratchpadEditorReducer(initial, {
    type: "run-transaction",
    id: 2,
    reason: "selection.set",
    persistence: "none",
    operations: [{ type: "select-item", id: second.id, additive: false }],
  });

  const cleared = scratchpadEditorReducer(selected, {
    type: "run-transaction",
    id: 3,
    reason: "selection.clear",
    persistence: "none",
    operations: [{ type: "clear-selection" }],
  });

  assert.deepEqual(selected.selectedItemIds, [second.id]);
  assert.equal(selected.lastActiveItemId, second.id);
  assert.deepEqual(cleared.selectedItemIds, []);
  assert.equal(cleared.lastActiveItemId, second.id);
});

test("editor reducer clears last active item when it is deleted", () => {
  const first = createScratchpadItem(0, 0, 1);
  const second = createScratchpadItem(10, 10, 2);
  const initial = scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "hydrate",
    items: [first, second],
    viewport: { x: 0, y: 0, scale: 1 },
  });
  const selected = scratchpadEditorReducer(initial, {
    type: "run-transaction",
    id: 2,
    reason: "selection.set",
    persistence: "none",
    operations: [{ type: "select-item", id: first.id, additive: false }],
  });

  const unrelatedDeleted = scratchpadEditorReducer(selected, {
    type: "run-transaction",
    id: 3,
    reason: "item.delete",
    persistence: "immediate",
    operations: [{ type: "delete-items", ids: [second.id] }],
  });
  const activeDeleted = scratchpadEditorReducer(unrelatedDeleted, {
    type: "run-transaction",
    id: 4,
    reason: "item.delete",
    persistence: "immediate",
    operations: [{ type: "delete-items", ids: [first.id] }],
  });

  assert.equal(unrelatedDeleted.lastActiveItemId, first.id);
  assert.equal(activeDeleted.lastActiveItemId, null);
});

test("editor reducer patches layout and content independently", () => {
  const item = createScratchpadItem(12, 24, 1);
  const initial = scratchpadEditorReducer(createScratchpadEditorState(), {
    type: "hydrate",
    items: [item],
    viewport: { x: 0, y: 0, scale: 1 },
  });

  const state = scratchpadEditorReducer(initial, {
    type: "run-transaction",
    id: 2,
    reason: "item.patch",
    persistence: "debounced",
    operations: [
      {
        type: "patch-item",
        id: item.id,
        patch: {
          layout: { x: 40 },
          content: { body: "Updated body" },
        },
      },
    ],
  });

  assert.deepEqual(state.document.items[0].layout, {
    ...item.layout,
    x: 40,
  });
  assert.deepEqual(state.document.items[0].content, {
    ...item.content,
    body: "Updated body",
  });
  assert.deepEqual(state.document.items[0].timestamps, item.timestamps);
});

test("selected item selector reads from document state", () => {
  const first = createScratchpadItem(0, 0, 1);
  const second = createScratchpadItem(10, 10, 2);

  const selectedItems = getSelectedScratchpadItems({
    document: {
      items: [first, second],
    },
    selectedItemIds: [second.id],
  });

  assert.deepEqual(selectedItems, [second]);
});

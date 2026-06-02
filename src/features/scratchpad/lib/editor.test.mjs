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
  assert.equal(state.lastTransaction?.changes.items, true);
});

test("editor reducer patches layout, content, and sync independently", () => {
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
          sync: { status: "dirty", lastError: "Retry later" },
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
  assert.deepEqual(state.document.items[0].sync, {
    ...item.sync,
    status: "dirty",
    lastError: "Retry later",
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

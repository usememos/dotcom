import assert from "node:assert/strict";
import test from "node:test";
import { clampContextMenuPosition } from "./context-menu-position.ts";

test("clampContextMenuPosition preserves in-bounds positions", () => {
  assert.deepEqual(
    clampContextMenuPosition({
      x: 100,
      y: 80,
      menuWidth: 128,
      menuHeight: 44,
      gutter: 8,
      viewportWidth: 500,
      viewportHeight: 400,
    }),
    { x: 100, y: 80 },
  );
});

test("clampContextMenuPosition keeps menu inside viewport", () => {
  assert.deepEqual(
    clampContextMenuPosition({
      x: 490,
      y: 390,
      menuWidth: 128,
      menuHeight: 44,
      gutter: 8,
      viewportWidth: 500,
      viewportHeight: 400,
    }),
    { x: 364, y: 348 },
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import { calculateScratchpadItemLayout } from "./item-positioning.ts";

const viewport = { x: 0, y: 0, scale: 1 };

test("calculateScratchpadItemLayout centers text cards near the requested point", () => {
  const layout = calculateScratchpadItemLayout({
    x: 400,
    y: 300,
    hasAttachments: false,
    viewport,
    viewportSize: { width: 1200, height: 800 },
    zIndex: 7,
  });

  assert.deepEqual(layout, {
    x: 260,
    y: 212,
    width: 280,
    height: 180,
    zIndex: 7,
  });
});

test("calculateScratchpadItemLayout clamps cards into the visible viewport", () => {
  const layout = calculateScratchpadItemLayout({
    x: 0,
    y: 0,
    hasAttachments: false,
    viewport,
    viewportSize: { width: 320, height: 240 },
    zIndex: 1,
  });

  assert.equal(layout.x, 24);
  assert.equal(layout.y, 24);
});

test("calculateScratchpadItemLayout sizes attachment cards for previews", () => {
  const layout = calculateScratchpadItemLayout({
    x: 500,
    y: 400,
    hasAttachments: true,
    viewport,
    viewportSize: { width: 1200, height: 800 },
    zIndex: 3,
  });

  assert.equal(layout.width, 320);
  assert.equal(layout.height, 300);
});

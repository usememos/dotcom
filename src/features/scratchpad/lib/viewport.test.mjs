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

const { centerScratchpadViewportOnCanvasPoint, DEFAULT_SCRATCHPAD_VIEWPORT, MAX_SCRATCHPAD_SCALE } = await import("./viewport.ts");

test("centers a canvas point in the viewport at the requested scale", () => {
  const viewport = centerScratchpadViewportOnCanvasPoint({ left: 0, top: 0, width: 800, height: 600 }, { x: 125, y: 80 }, 1.2);

  assert.deepEqual(viewport, {
    x: 250,
    y: 204,
    scale: 1.2,
  });
});

test("clamps the scale while centering the canvas point", () => {
  const viewport = centerScratchpadViewportOnCanvasPoint({ left: 0, top: 0, width: 500, height: 300 }, { x: 50, y: 30 }, 10);

  assert.deepEqual(viewport, {
    x: 250 - 50 * MAX_SCRATCHPAD_SCALE,
    y: 150 - 30 * MAX_SCRATCHPAD_SCALE,
    scale: MAX_SCRATCHPAD_SCALE,
  });
});

test("resets to 100% while centering a canvas point", () => {
  const viewport = centerScratchpadViewportOnCanvasPoint(
    { left: 0, top: 0, width: 800, height: 600 },
    { x: 640, y: 420 },
    DEFAULT_SCRATCHPAD_VIEWPORT.scale,
  );

  assert.deepEqual(viewport, {
    x: -240,
    y: -120,
    scale: 1,
  });
});

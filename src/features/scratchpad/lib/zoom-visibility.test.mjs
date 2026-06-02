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

const { ZOOM_CONTROLS_HIDE_DELAY_MS, shouldShowZoomControls } = await import("./zoom-visibility.ts");

test("zoom controls are hidden by default", () => {
  assert.equal(
    shouldShowZoomControls({
      hovered: false,
      focused: false,
      lastInteractionAt: null,
      now: 1000,
    }),
    false,
  );
});

test("zoom controls are visible while hovered or focused", () => {
  assert.equal(
    shouldShowZoomControls({
      hovered: true,
      focused: false,
      lastInteractionAt: null,
      now: 1000,
    }),
    true,
  );
  assert.equal(
    shouldShowZoomControls({
      hovered: false,
      focused: true,
      lastInteractionAt: null,
      now: 1000,
    }),
    true,
  );
});

test("zoom controls remain visible briefly after interaction", () => {
  const lastInteractionAt = 1000;

  assert.equal(
    shouldShowZoomControls({
      hovered: false,
      focused: false,
      lastInteractionAt,
      now: lastInteractionAt + ZOOM_CONTROLS_HIDE_DELAY_MS - 1,
    }),
    true,
  );
  assert.equal(
    shouldShowZoomControls({
      hovered: false,
      focused: false,
      lastInteractionAt,
      now: lastInteractionAt + ZOOM_CONTROLS_HIDE_DELAY_MS,
    }),
    false,
  );
  assert.equal(
    shouldShowZoomControls({
      hovered: false,
      focused: false,
      lastInteractionAt,
      now: lastInteractionAt + ZOOM_CONTROLS_HIDE_DELAY_MS + 1,
    }),
    false,
  );
});

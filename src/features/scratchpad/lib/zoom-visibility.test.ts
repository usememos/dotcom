import { describe, expect, it } from "vitest";
import { shouldShowZoomControls, ZOOM_CONTROLS_HIDE_DELAY_MS } from "./zoom-visibility";

describe("shouldShowZoomControls", () => {
  it("shows while hovered or focused", () => {
    expect(shouldShowZoomControls({ hovered: true, focused: false, lastInteractionAt: null, now: 0 })).toBe(true);
    expect(shouldShowZoomControls({ hovered: false, focused: true, lastInteractionAt: null, now: 0 })).toBe(true);
  });

  it("hides when idle and never interacted", () => {
    expect(shouldShowZoomControls({ hovered: false, focused: false, lastInteractionAt: null, now: 1000 })).toBe(false);
  });

  it("shows within the hide delay and hides after it", () => {
    expect(shouldShowZoomControls({ hovered: false, focused: false, lastInteractionAt: 0, now: ZOOM_CONTROLS_HIDE_DELAY_MS - 1 })).toBe(
      true,
    );
    expect(shouldShowZoomControls({ hovered: false, focused: false, lastInteractionAt: 0, now: ZOOM_CONTROLS_HIDE_DELAY_MS })).toBe(false);
  });
});

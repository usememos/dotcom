import { describe, expect, it } from "vitest";
import {
  centerScratchpadViewportOnCanvasPoint,
  clampScratchpadScale,
  DEFAULT_SCRATCHPAD_VIEWPORT,
  MAX_SCRATCHPAD_SCALE,
  MIN_SCRATCHPAD_SCALE,
  panScratchpadViewport,
  screenPointToCanvasPoint,
  zoomScratchpadViewportAtPoint,
  zoomScratchpadViewportFromCenter,
} from "./viewport";

describe("clampScratchpadScale", () => {
  it("clamps to the min/max bounds", () => {
    expect(clampScratchpadScale(0.1)).toBe(MIN_SCRATCHPAD_SCALE);
    expect(clampScratchpadScale(99)).toBe(MAX_SCRATCHPAD_SCALE);
    expect(clampScratchpadScale(1)).toBe(1);
  });
});

describe("screenPointToCanvasPoint", () => {
  it("subtracts rect + pan then divides by scale", () => {
    const result = screenPointToCanvasPoint(120, 220, { left: 20, top: 20 }, { x: 0, y: 0, scale: 2 });
    expect(result).toEqual({ x: 50, y: 100 });
  });
});

describe("panScratchpadViewport", () => {
  it("adds the delta and preserves scale", () => {
    expect(panScratchpadViewport({ x: 10, y: 10, scale: 1.5 }, 5, -3)).toEqual({ x: 15, y: 7, scale: 1.5 });
  });
});

describe("zoomScratchpadViewportAtPoint", () => {
  it("keeps the canvas point under the pointer fixed", () => {
    const start = DEFAULT_SCRATCHPAD_VIEWPORT;
    // 1.5 is within [MIN, MAX] (MAX is 1.8), so no clamping interferes.
    const next = zoomScratchpadViewportAtPoint(start, 100, 100, 1.5);
    expect(next).toEqual({ x: -50, y: -50, scale: 1.5 });
    expect(screenPointToCanvasPoint(100, 100, { left: 0, top: 0 }, next)).toEqual(
      screenPointToCanvasPoint(100, 100, { left: 0, top: 0 }, start),
    );
  });

  it("clamps the resulting scale", () => {
    expect(zoomScratchpadViewportAtPoint(DEFAULT_SCRATCHPAD_VIEWPORT, 0, 0, 99).scale).toBe(MAX_SCRATCHPAD_SCALE);
  });
});

describe("zoomScratchpadViewportFromCenter", () => {
  it("zooms about the rect center", () => {
    const rect = { left: 0, top: 0, width: 200, height: 100 };
    const next = zoomScratchpadViewportFromCenter({ x: 0, y: 0, scale: 1 }, rect, 1.5);
    expect(next.scale).toBe(1.5);
    expect(next).toEqual(zoomScratchpadViewportAtPoint({ x: 0, y: 0, scale: 1 }, 100, 50, 1.5));
  });
});

describe("centerScratchpadViewportOnCanvasPoint", () => {
  it("positions the canvas point at the rect center", () => {
    const rect = { left: 0, top: 0, width: 200, height: 100 };
    const next = centerScratchpadViewportOnCanvasPoint(rect, { x: 50, y: 25 }, 1.5);
    expect(next).toEqual({ x: 100 - 50 * 1.5, y: 50 - 25 * 1.5, scale: 1.5 });
  });
});

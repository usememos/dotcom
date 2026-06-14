import { describe, expect, it } from "vitest";
import { calculateScratchpadItemLayout } from "./item-positioning";

const viewport = { x: 0, y: 0, scale: 1 };
const viewportSize = { width: 1000, height: 800 };

describe("calculateScratchpadItemLayout", () => {
  it("sizes and centers a text item within bounds", () => {
    const layout = calculateScratchpadItemLayout({ x: 500, y: 300, hasAttachments: false, viewport, viewportSize, zIndex: 5 });
    expect(layout).toEqual({ x: 360, y: 212, width: 280, height: 180, zIndex: 5 });
  });

  it("uses the larger attachment dimensions", () => {
    const layout = calculateScratchpadItemLayout({ x: 500, y: 300, hasAttachments: true, viewport, viewportSize, zIndex: 1 });
    expect(layout.width).toBe(320);
    expect(layout.height).toBe(300);
  });

  it("clamps within the screen gutter on a tiny viewport", () => {
    const layout = calculateScratchpadItemLayout({
      x: 0,
      y: 0,
      hasAttachments: false,
      viewport,
      viewportSize: { width: 300, height: 300 },
      zIndex: 1,
    });
    expect(layout.x).toBeGreaterThanOrEqual(24);
    expect(layout.y).toBeGreaterThanOrEqual(24);
    expect(layout.width).toBeLessThanOrEqual(280);
  });

  it("divides available width by the viewport scale", () => {
    const layout = calculateScratchpadItemLayout({
      x: 0,
      y: 0,
      hasAttachments: false,
      viewport: { x: 0, y: 0, scale: 2 },
      viewportSize: { width: 400, height: 400 },
      zIndex: 1,
    });
    // available = floor((400 - 48) / 2) = 176, floored to MIN width 220 → width min(280,220)=220
    expect(layout.width).toBe(220);
  });
});

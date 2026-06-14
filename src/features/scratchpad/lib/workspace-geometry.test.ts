import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import {
  formatScratchpadZoomLabel,
  getScratchpadItemCenter,
  getScratchpadWheelZoomFactor,
  isZoomGestureTargetAllowed,
} from "./workspace-geometry";

const item: ScratchpadItem = {
  id: "a",
  layout: { x: 100, y: 200, width: 280, height: 180, zIndex: 1 },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
};

describe("getScratchpadItemCenter", () => {
  it("returns the layout center", () => {
    expect(getScratchpadItemCenter(item)).toEqual({ x: 100 + 140, y: 200 + 90 });
  });
});

describe("formatScratchpadZoomLabel", () => {
  it("renders a rounded percent", () => {
    expect(formatScratchpadZoomLabel(1)).toBe("100%");
    expect(formatScratchpadZoomLabel(1.234)).toBe("123%");
  });
});

describe("getScratchpadWheelZoomFactor", () => {
  it("is >1 when scrolling up (negative deltaY) and <1 scrolling down", () => {
    expect(getScratchpadWheelZoomFactor(-100, 0.0015)).toBeGreaterThan(1);
    expect(getScratchpadWheelZoomFactor(100, 0.0015)).toBeLessThan(1);
    expect(getScratchpadWheelZoomFactor(0, 0.0015)).toBe(1);
  });
});

describe("isZoomGestureTargetAllowed", () => {
  function el(tag: string, attrs: Record<string, string> = {}) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  }
  it("allows a plain canvas path", () => {
    expect(isZoomGestureTargetAllowed([el("div"), el("section")])).toBe(true);
  });
  it("blocks UI-marked, form, and role-dialog targets", () => {
    expect(isZoomGestureTargetAllowed([el("div", { "data-scratchpad-ui": "true" })])).toBe(false);
    expect(isZoomGestureTargetAllowed([el("button")])).toBe(false);
    expect(isZoomGestureTargetAllowed([el("textarea")])).toBe(false);
    expect(isZoomGestureTargetAllowed([el("div", { role: "menu" })])).toBe(false);
  });
});

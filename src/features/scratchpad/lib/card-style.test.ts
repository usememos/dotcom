import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import { getCardRingClass, getCardRotation, getCardToneClassNames, SCRATCHPAD_CARD_TONE_CLASS_NAMES } from "./card-style";

const item = (overrides: Partial<ScratchpadItem> = {}): ScratchpadItem => ({
  id: "item-1",
  layout: { x: 0, y: 0, width: 280, height: 180, zIndex: 1 },
  content: { body: "", attachments: [] },
  timestamps: { createdAt: new Date(0), updatedAt: new Date(0) },
  ...overrides,
});

describe("getCardRotation", () => {
  it("is deterministic per id and within ±0.7°", () => {
    const rotation = getCardRotation(item({ id: "abc" }));
    expect(rotation).toBe(getCardRotation(item({ id: "abc" })));
    expect(Math.abs(rotation)).toBeLessThanOrEqual(0.7);
    expect(rotation % 0.35).toBeCloseTo(0, 10);
  });
});

describe("getCardToneClassNames", () => {
  it("defaults to the yellow tone", () => {
    expect(getCardToneClassNames(item())).toBe(SCRATCHPAD_CARD_TONE_CLASS_NAMES.yellow);
  });
  it("uses the item's tone when set", () => {
    expect(getCardToneClassNames(item({ tone: "blue" }))).toBe(SCRATCHPAD_CARD_TONE_CLASS_NAMES.blue);
  });
});

describe("getCardRingClass", () => {
  it("returns a ring class only when selected", () => {
    expect(getCardRingClass(true)).toContain("ring-1");
    expect(getCardRingClass(false)).toBe("");
    expect(getCardRingClass()).toBe("");
  });
});

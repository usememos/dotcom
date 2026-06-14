import { describe, expect, it } from "vitest";
import type { ScratchpadItem } from "../types";
import {
  CARD_TEXT_CLASS_NAME,
  getCardChromeClassNames,
  getCardResizeHandleClassNames,
  getCardRingClass,
  getCardRotation,
  getCardToneClassNames,
  SCRATCHPAD_CARD_TONE_CLASS_NAMES,
} from "./card-style";

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
  it("selected cards use the exact restrained one-pixel dark-mode ring string", () => {
    expect(getCardRingClass(true)).toBe("ring-1 ring-stone-900/20 shadow-[0_18px_40px_rgba(28,25,23,0.14)] dark:ring-stone-200/30");
  });
});

describe("getCardChromeClassNames", () => {
  it("keeps compact rounded corners and a shadow", () => {
    expect(getCardChromeClassNames()).toBe(
      "rounded-[6px] border shadow-[0_10px_26px_rgba(28,25,23,0.08)] dark:shadow-[0_18px_44px_rgba(0,0,0,0.28)]",
    );
  });
});

describe("getCardResizeHandleClassNames", () => {
  it("fades in on card group hover", () => {
    expect(getCardResizeHandleClassNames()).toBe(
      "absolute bottom-0 right-0 h-8 w-8 cursor-se-resize opacity-0 transition-opacity group-hover/card:opacity-45 group-hover:opacity-80 group-focus-within/card:opacity-60",
    );
  });
});

describe("CARD_TEXT_CLASS_NAME", () => {
  it("equals the exact fixed readable sizing value", () => {
    expect(CARD_TEXT_CLASS_NAME).toBe("font-sans text-[14px] leading-6 tracking-normal");
  });
  it("does not use viewport-relative sizing", () => {
    expect(CARD_TEXT_CLASS_NAME).not.toMatch(/\b(vw|vh|clamp)\b/);
  });
});

describe("SCRATCHPAD_CARD_TONE_CLASS_NAMES", () => {
  it("all five tones include base bg-, text-, dark:bg-, and dark:text- classes", () => {
    const tones = ["yellow", "pink", "blue", "green", "purple"] as const;
    for (const tone of tones) {
      const classNames = SCRATCHPAD_CARD_TONE_CLASS_NAMES[tone];
      expect(classNames, `${tone} should include a base background class`).toContain("bg-");
      expect(classNames, `${tone} should include a base text class`).toContain("text-");
      expect(classNames, `${tone} should include a dark background class`).toContain("dark:bg-");
      expect(classNames, `${tone} should include a dark text class`).toContain("dark:text-");
    }
  });
  it("default (yellow) tone has exact restrained light and dark classes", () => {
    const classNames = SCRATCHPAD_CARD_TONE_CLASS_NAMES.yellow;
    expect(classNames).toContain("bg-[#f7f0c6]");
    expect(classNames).toContain("dark:bg-[#343126]");
    expect(classNames).toContain("dark:text-stone-100");
  });
});

describe("getCardRotation — spans both directions", () => {
  it("produces both negative and positive rotations across ~24 different ids", () => {
    const ids = Array.from({ length: 24 }, (_, index) => `rotation-card-${index}`);
    const rotations = ids.map((id) => getCardRotation(item({ id })));
    expect(rotations.every((r) => r >= -0.7 && r <= 0.7)).toBe(true);
    expect(rotations.some((r) => r < 0)).toBe(true);
    expect(rotations.some((r) => r > 0)).toBe(true);
  });
});

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

const {
  CARD_TEXT_CLASS_NAME,
  SCRATCHPAD_CARD_TONE_CLASS_NAMES,
  getCardChromeClassNames,
  getCardResizeHandleClassNames,
  getCardRotation,
  getCardRingClass,
  getCardToneClassNames,
} = await import("./card-style.ts");
const { createScratchpadItem } = await import("./item-model.ts");

test("default card tone uses restrained yellow light and dark classes", () => {
  const classNames = getCardToneClassNames(createScratchpadItem(0, 0, 1));

  assert.equal(classNames.includes("bg-[#f7f0c6]"), true);
  assert.equal(classNames.includes("dark:bg-[#343126]"), true);
  assert.equal(classNames.includes("dark:text-stone-100"), true);
});

test("all card tones include base and dark-mode color classes", () => {
  const tones = /** @type {const} */ (["yellow", "pink", "blue", "green", "purple"]);

  for (const tone of tones) {
    const classNames = SCRATCHPAD_CARD_TONE_CLASS_NAMES[tone];

    assert.equal(classNames.includes("bg-"), true, `${tone} should include a base background class`);
    assert.equal(classNames.includes("text-"), true, `${tone} should include a base text class`);
    assert.equal(classNames.includes("dark:bg-"), true, `${tone} should include a dark background class`);
    assert.equal(classNames.includes("dark:text-"), true, `${tone} should include a dark text class`);
  }
});

test("card rotation is deterministic, bounded, and spans both directions", () => {
  const ids = Array.from({ length: 24 }, (_, index) => `rotation-card-${index}`);
  const rotations = ids.map((id) => getCardRotation({ ...createScratchpadItem(0, 0, 1), id }));

  assert.equal(
    getCardRotation({ ...createScratchpadItem(0, 0, 1), id: "stable-card" }),
    getCardRotation({ ...createScratchpadItem(8, 8, 2), id: "stable-card" }),
  );
  assert.equal(
    rotations.every((rotation) => rotation >= -0.7 && rotation <= 0.7),
    true,
  );
  assert.equal(
    rotations.some((rotation) => rotation < 0),
    true,
  );
  assert.equal(
    rotations.some((rotation) => rotation > 0),
    true,
  );
});

test("unselected cards do not render a ring class", () => {
  assert.equal(getCardRingClass(false), "");
});

test("selected cards use a restrained one-pixel dark-mode ring", () => {
  assert.equal(getCardRingClass(true), "ring-1 ring-stone-900/20 shadow-[0_18px_40px_rgba(28,25,23,0.14)] dark:ring-stone-200/30");
});

test("card chrome keeps compact rounded corners and a shadow", () => {
  assert.equal(
    getCardChromeClassNames(),
    "rounded-[6px] border shadow-[0_10px_26px_rgba(28,25,23,0.08)] dark:shadow-[0_18px_44px_rgba(0,0,0,0.28)]",
  );
});

test("resize handle fades in on card group hover", () => {
  assert.equal(
    getCardResizeHandleClassNames(),
    "absolute bottom-0 right-0 h-8 w-8 cursor-se-resize opacity-0 transition-opacity group-hover/card:opacity-45 group-hover:opacity-80 group-focus-within/card:opacity-60",
  );
});

test("card text uses fixed readable sizing without viewport scaling", () => {
  assert.equal(CARD_TEXT_CLASS_NAME, "font-sans text-[14px] leading-6 tracking-normal");
  assert.doesNotMatch(CARD_TEXT_CLASS_NAME, /\b(vw|vh|clamp)\b/);
});

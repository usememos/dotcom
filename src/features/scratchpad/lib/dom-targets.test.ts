import { afterEach, describe, expect, it } from "vitest";
import { findScratchpadItemId, isWithinScratchpadItem, isWithinScratchpadUi } from "./dom-targets";

afterEach(() => {
  document.body.innerHTML = "";
});

function build() {
  const boundary = document.createElement("div");
  const card = document.createElement("div");
  card.dataset.scratchpadItemId = "item-7";
  card.dataset.scratchpadItem = "true";
  const child = document.createElement("span");
  card.appendChild(child);
  boundary.appendChild(card);
  document.body.appendChild(boundary);
  return { boundary, card, child };
}

describe("findScratchpadItemId", () => {
  it("walks up to the nearest item id", () => {
    const { boundary, child } = build();
    expect(findScratchpadItemId(child, boundary)).toBe("item-7");
  });
  it("returns undefined past the boundary", () => {
    const { boundary } = build();
    expect(findScratchpadItemId(boundary, boundary)).toBeUndefined();
    expect(findScratchpadItemId(null, boundary)).toBeUndefined();
  });
});

describe("isWithinScratchpadItem", () => {
  it("is true inside an item and false at/above the boundary", () => {
    const { boundary, child } = build();
    expect(isWithinScratchpadItem(child, boundary)).toBe(true);
    expect(isWithinScratchpadItem(boundary, boundary)).toBe(false);
  });
});

describe("isWithinScratchpadUi", () => {
  it("detects the data-scratchpad-ui marker", () => {
    const boundary = document.createElement("div");
    const ui = document.createElement("div");
    ui.dataset.scratchpadUi = "true";
    const inner = document.createElement("button");
    ui.appendChild(inner);
    boundary.appendChild(ui);
    expect(isWithinScratchpadUi(inner, boundary)).toBe(true);
    expect(isWithinScratchpadUi(boundary, boundary)).toBe(false);
  });
});

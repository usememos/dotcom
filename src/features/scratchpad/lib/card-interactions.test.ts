import { describe, expect, it } from "vitest";
import { CARD_NEW_EDIT_WINDOW_MS, computeCardDragPosition, computeCardResizeSize, shouldStartEditingNewCard } from "./card-interactions";

describe("shouldStartEditingNewCard", () => {
  const now = 10_000;
  it("starts editing a brand-new empty card", () => {
    expect(shouldStartEditingNewCard({ body: "  ", attachmentCount: 0, createdAt: new Date(now - 1000) }, now)).toBe(true);
  });
  it("does not start editing when the card has a body", () => {
    expect(shouldStartEditingNewCard({ body: "hi", attachmentCount: 0, createdAt: new Date(now) }, now)).toBe(false);
  });
  it("does not start editing when the card has attachments", () => {
    expect(shouldStartEditingNewCard({ body: "", attachmentCount: 1, createdAt: new Date(now) }, now)).toBe(false);
  });
  it("does not start editing an old card", () => {
    expect(shouldStartEditingNewCard({ body: "", attachmentCount: 0, createdAt: new Date(now - CARD_NEW_EDIT_WINDOW_MS) }, now)).toBe(
      false,
    );
  });
});

describe("computeCardDragPosition", () => {
  it("adds the scaled pointer delta to the drag origin", () => {
    const pos = computeCardDragPosition({ x: 100, y: 50 }, { startClientX: 10, startClientY: 10 }, 30, 50, 2);
    expect(pos).toEqual({ x: 100 + (30 - 10) / 2, y: 50 + (50 - 10) / 2 });
  });
});

describe("computeCardResizeSize", () => {
  const session = { startWidth: 300, startHeight: 200, startClientX: 0, startClientY: 0 };
  it("grows by the scaled pointer delta", () => {
    expect(computeCardResizeSize(session, 40, 20, 2, 220, 170)).toEqual({ width: 320, height: 210 });
  });
  it("clamps to the minimums", () => {
    expect(computeCardResizeSize(session, -1000, -1000, 1, 220, 170)).toEqual({ width: 220, height: 170 });
  });
});

import { describe, expect, it } from "vitest";
import { clampContextMenuPosition } from "./context-menu-position";

const base = { menuWidth: 100, menuHeight: 80, gutter: 8, viewportWidth: 500, viewportHeight: 400 };

describe("clampContextMenuPosition", () => {
  it("returns the requested point when it fits", () => {
    expect(clampContextMenuPosition({ ...base, x: 50, y: 50 })).toEqual({ x: 50, y: 50 });
  });

  it("pulls the menu in when it would overflow the right/bottom edge", () => {
    expect(clampContextMenuPosition({ ...base, x: 480, y: 380 })).toEqual({
      x: 500 - 100 - 8,
      y: 400 - 80 - 8,
    });
  });
});

import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScratchpadViewportLock } from "./scratchpad-viewport-lock";

afterEach(() => {
  document.head.querySelectorAll('meta[name="viewport"]').forEach((node) => node.remove());
});

describe("ScratchpadViewportLock", () => {
  it("sets the locked viewport meta while mounted and removes it on unmount when none existed", () => {
    const { unmount } = render(<ScratchpadViewportLock />);
    const meta = document.head.querySelector('meta[name="viewport"]');
    expect(meta?.getAttribute("content")).toContain("maximum-scale=1.0");
    expect(meta?.getAttribute("content")).toContain("user-scalable=no");

    unmount();
    expect(document.head.querySelector('meta[name="viewport"]')).toBeNull();
  });

  it("restores a pre-existing viewport meta on unmount", () => {
    const existing = document.createElement("meta");
    existing.setAttribute("name", "viewport");
    existing.setAttribute("content", "width=device-width, initial-scale=1");
    document.head.appendChild(existing);

    const { unmount } = render(<ScratchpadViewportLock />);
    expect(existing.getAttribute("content")).toContain("user-scalable=no");
    unmount();
    expect(existing.getAttribute("content")).toBe("width=device-width, initial-scale=1");
  });
});

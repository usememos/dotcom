import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getScratchpadCanvasBackgroundStyle, ScratchpadCanvasBackground } from "./scratchpad-canvas-background";

describe("getScratchpadCanvasBackgroundStyle", () => {
  it("encodes the pan offset and scale-derived grid sizes", () => {
    const style = getScratchpadCanvasBackgroundStyle({ x: 12, y: 34, scale: 2 });
    expect(style.backgroundPosition).toContain("12px 34px");
    expect(style.backgroundSize).toContain("64px 64px"); // 32 * scale
    expect(style.backgroundSize).toContain("320px 320px"); // 160 * scale
  });
});

describe("ScratchpadCanvasBackground", () => {
  it("renders a styled background layer", () => {
    const { container } = render(<ScratchpadCanvasBackground viewport={{ x: 0, y: 0, scale: 1 }} />);
    const layer = container.firstChild as HTMLElement;
    expect(layer).toHaveStyle({ backgroundPosition: "0px 0px, 0px 0px, 0px 0px, 0px 0px" });
  });
});

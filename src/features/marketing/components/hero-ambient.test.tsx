import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroAmbient } from "./hero-ambient";

describe("HeroAmbient", () => {
  it("renders a decorative layer hidden from assistive tech and non-interactive", () => {
    const { container } = render(<HeroAmbient />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).not.toBeNull();
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.className).toContain("pointer-events-none");
  });

  it("renders two sub-layers (dot grid + glow)", () => {
    const { container } = render(<HeroAmbient />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.children).toHaveLength(2);
  });
});

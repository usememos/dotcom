import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroAccent } from "./hero-accent";

describe("HeroAccent", () => {
  it("renders its children", () => {
    render(<HeroAccent>shared on your terms.</HeroAccent>);
    expect(screen.getByText("shared on your terms.")).toBeInTheDocument();
  });

  it("applies the brand accent classes for light and dark mode", () => {
    render(<HeroAccent>shared on your terms.</HeroAccent>);
    expect(screen.getByText("shared on your terms.")).toHaveClass("text-brand-600", "dark:text-brand-300");
  });
});

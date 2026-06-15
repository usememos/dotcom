import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroAccent } from "./hero-accent";

describe("HeroAccent", () => {
  it("renders its children", () => {
    render(<HeroAccent>Keep it yours.</HeroAccent>);
    expect(screen.getByText("Keep it yours.")).toBeInTheDocument();
  });

  it("applies the brand teal accent classes for light and dark mode", () => {
    render(<HeroAccent>Keep it yours.</HeroAccent>);
    expect(screen.getByText("Keep it yours.")).toHaveClass("text-teal-600", "dark:text-teal-300");
  });
});

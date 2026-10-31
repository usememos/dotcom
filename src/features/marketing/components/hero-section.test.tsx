import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("pairs the headline and quiet actions with the product preview on a plain canvas", () => {
    const { container } = render(
      <HeroSection
        title="Test headline"
        subtitle="Test subtitle"
        primaryCta={{ text: "Install", href: "/install" }}
        secondaryCta={{ text: "Demo", href: "https://demo.example.com/", external: true }}
      />,
    );

    const heading = screen.getByRole("heading", { name: "Test headline" });
    expect(heading).toBeInTheDocument();
    expect(screen.getByText("Test subtitle")).toHaveClass("text-balance");
    // Scale the brand headline on narrow screens without preventing text wrapping.
    expect(heading.className).toMatch(/text-\[clamp\(/);
    expect(heading.className).not.toMatch(/whitespace-nowrap|text-nowrap/);
    expect(screen.getByRole("link", { name: /Latest release\s*26\.10\.0/ })).toHaveAttribute("href", "/changelog/26-10-0");
    expect(screen.getByRole("link", { name: "Install" })).toHaveAttribute("href", "/install");
    const demo = screen.getByRole("link", { name: "Demo" });
    expect(demo).toHaveAttribute("href", "https://demo.example.com/");
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.queryByText("Deploys in seconds")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Install" })).not.toHaveClass("bg-zinc-950");

    expect(screen.getByRole("region", { name: "Example memos — scroll to explore" })).toBeInTheDocument();
    expect(container.querySelector('[class*="radial-gradient"]')).toBeNull();
  });

  it("preserves the prefix and changelog link for historical releases", () => {
    render(
      <HeroSection
        version="0.31.0"
        title="Test headline"
        subtitle="Test subtitle"
        primaryCta={{ text: "Install", href: "/install" }}
        secondaryCta={{ text: "Demo", href: "/demo" }}
      />,
    );

    expect(screen.getByRole("link", { name: /Latest release\s*v0\.31\.0/ })).toHaveAttribute("href", "/changelog/0-31-0");
  });
});

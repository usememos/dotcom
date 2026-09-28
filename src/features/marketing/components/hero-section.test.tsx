import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BRAND_PROOF_POINTS } from "@/shared/lib/branding";
import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("renders the headline and the ambient decorative layer behind it", () => {
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
    // Scale the brand headline on narrow screens without preventing text wrapping.
    expect(heading.className).toMatch(/text-\[clamp\(/);
    expect(heading.className).not.toMatch(/whitespace-nowrap|text-nowrap/);
    expect(screen.getByRole("link", { name: /Latest release\s*v0\.31\.0/ })).toHaveAttribute("href", "/changelog/0-31-0");
    expect(screen.getByRole("link", { name: "Install" })).toHaveAttribute("href", "/install");
    const demo = screen.getByRole("link", { name: "Demo" });
    expect(demo).toHaveAttribute("href", "https://demo.example.com/");
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo).toHaveAttribute("rel", "noopener noreferrer");

    for (const point of BRAND_PROOF_POINTS) {
      expect(screen.getByText(point)).toBeVisible();
    }

    const ambient = container.querySelector('[aria-hidden="true"].pointer-events-none');
    expect(ambient).not.toBeNull();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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

    expect(screen.getByRole("heading", { name: "Test headline" })).toBeInTheDocument();

    const ambient = container.querySelector('[aria-hidden="true"].pointer-events-none');
    expect(ambient).not.toBeNull();
  });
});

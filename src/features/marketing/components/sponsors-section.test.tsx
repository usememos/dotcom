import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { COMMUNITY_SPONSORS, FEATURED_SPONSORS } from "@/shared/data/sponsors";

vi.mock("@/shared/ui/carbon-ad-card", () => ({
  CarbonAdCard: ({ variant }: { variant?: string }) => <aside data-testid="carbon-ad" data-variant={variant} />,
}));

import { SponsorsSection } from "./sponsors-section";

describe("SponsorsSection", () => {
  it("introduces the current backers and invites new sponsors", () => {
    render(<SponsorsSection />);

    expect(screen.getByRole("heading", { name: "Built with their support." })).toBeInTheDocument();

    const sponsorCta = screen.getByRole("link", { name: "Become a sponsor" });
    expect(sponsorCta).toHaveAttribute("href", "https://github.com/sponsors/usememos");
    expect(sponsorCta).toHaveAttribute("target", "_blank");
    expect(sponsorCta.getAttribute("rel")?.split(/\s+/)).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
  });

  it("shows every paid featured sponsor as a safe external link", () => {
    render(<SponsorsSection />);

    for (const sponsor of FEATURED_SPONSORS) {
      const link = screen.getAllByRole("link").find((candidate) => candidate.getAttribute("href") === sponsor.url);

      expect(link, `${sponsor.name} sponsor link`).toBeDefined();
      expect(link).toHaveAttribute("target", "_blank");
      expect(link?.getAttribute("rel")?.split(/\s+/)).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
      expect(link?.querySelector(`img[alt="${sponsor.name} logo"]`)).not.toBeNull();
    }

    for (const sponsor of COMMUNITY_SPONSORS) {
      expect(screen.queryByRole("link", { name: new RegExp(sponsor.name, "i") })).not.toBeInTheDocument();
    }
  });

  it("places the Carbon ad after every sponsor logo", () => {
    const { container } = render(<SponsorsSection />);
    const carbonAd = screen.getByTestId("carbon-ad");
    const logos = Array.from(container.querySelectorAll<HTMLImageElement>("img"));

    expect(container.querySelector("section")).toHaveAttribute("data-ads-placement", "main-content");
    expect(logos.length).toBeGreaterThanOrEqual(FEATURED_SPONSORS.length);
    expect(carbonAd).toHaveAttribute("data-variant", "sponsor");

    for (const logo of logos) {
      expect(logo.compareDocumentPosition(carbonAd) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });
});

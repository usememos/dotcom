import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { COMMUNITY_SPONSORS, FEATURED_SPONSORS } from "@/shared/data/sponsors";

vi.mock("@/shared/ui/carbon-ad-card", () => ({
  CarbonAdCard: ({ variant }: { variant?: string }) => <aside data-testid="carbon-ad" data-variant={variant} />,
}));

import { MemoHeroSponsors } from "./memo-hero-sponsors";

describe("MemoHeroSponsors", () => {
  it("supplies memo content without a second card or section heading", () => {
    render(<MemoHeroSponsors />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByText("Website sponsorship")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Meet our sponsors" })).not.toBeInTheDocument();
  });

  it("shows featured sponsors as safe links before a single Carbon placement", () => {
    render(<MemoHeroSponsors />);
    const carbonAd = screen.getByTestId("carbon-ad");
    expect(screen.getAllByTestId("carbon-ad")).toHaveLength(1);
    expect(carbonAd).toHaveAttribute("data-variant", "memo");

    for (const sponsor of FEATURED_SPONSORS) {
      const link = screen.getByRole("link", { name: sponsor.name });
      expect(link).toHaveAttribute("href", sponsor.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.getAttribute("rel")?.split(/\s+/)).toEqual(expect.arrayContaining(["noopener", "noreferrer", "sponsored"]));
      expect(link.querySelector("img")).toHaveAttribute("src", sponsor.logo);
      expect(link.compareDocumentPosition(carbonAd) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    for (const sponsor of COMMUNITY_SPONSORS) {
      expect(screen.queryByRole("link", { name: sponsor.name })).not.toBeInTheDocument();
    }
  });
});

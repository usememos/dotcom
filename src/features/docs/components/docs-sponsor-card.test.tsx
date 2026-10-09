import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FEATURED_SPONSORS } from "@/shared/data/sponsors";
import { DocsSponsorCard } from "./docs-sponsor-card";

describe("DocsSponsorCard", () => {
  it("shows each sponsor once in a wrapping row with bounded items", () => {
    const { container } = render(<DocsSponsorCard />);
    const group = screen.getByRole("group", { name: "Sponsors" });
    const links = within(group).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("aria-label"))).toEqual(FEATURED_SPONSORS.map((sponsor) => sponsor.name));
    expect(group.children).toHaveLength(FEATURED_SPONSORS.length);
    expect(group).toHaveClass("flex", "flex-wrap", "justify-start");
    expect(container.querySelector('[aria-hidden="true"] a')).not.toBeInTheDocument();

    for (const [index, link] of links.entries()) {
      expect(link).toBe(group.children[index]);
      expect(link).toHaveClass("max-h-10", "max-w-[min(10rem,100%)]", "flex-none", "justify-start");
      expect(link).toHaveAttribute("href", FEATURED_SPONSORS[index].url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      for (const logo of link.querySelectorAll("img")) {
        expect(logo).toHaveClass("max-h-6", "max-w-full", "object-contain", "object-left");
      }
    }

    expect(screen.getByRole("link", { name: "Sponsors" })).toHaveAttribute("href", "/sponsors");
  });
});

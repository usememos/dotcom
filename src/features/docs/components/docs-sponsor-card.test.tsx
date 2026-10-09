import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FEATURED_SPONSORS } from "@/shared/data/sponsors";
import { DocsSponsorCard } from "./docs-sponsor-card";

describe("DocsSponsorCard", () => {
  it("shows each sponsor once in list order with the same fixed row treatment", () => {
    const { container } = render(<DocsSponsorCard />);
    const group = screen.getByRole("group", { name: "Sponsors" });
    const links = within(group).getAllByRole("link");

    expect(links.map((link) => link.getAttribute("aria-label"))).toEqual(FEATURED_SPONSORS.map((sponsor) => sponsor.name));
    expect(group.children).toHaveLength(FEATURED_SPONSORS.length);
    expect(container.querySelector('[aria-hidden="true"] a')).not.toBeInTheDocument();

    for (const [index, link] of links.entries()) {
      expect(link).toBe(group.children[index]);
      expect(link).toHaveClass("h-10", "justify-start");
      expect(link).toHaveAttribute("href", FEATURED_SPONSORS[index].url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      for (const logo of link.querySelectorAll("img")) {
        expect(logo).toHaveClass("object-left");
      }
    }

    expect(screen.getByRole("link", { name: "Sponsors" })).toHaveAttribute("href", "/sponsors");
  });
});

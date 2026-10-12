import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { COMPARISON_CATEGORIES, COMPARISON_SLUGS, getComparisonSlugsByCategory } from "@/features/marketing/data/comparisons";
import ComparePage, { metadata } from "./page";

vi.mock("@/shared/ui/carbon-ad-card", () => ({
  CarbonAdCard: () => <div data-testid="carbon-ad" />,
}));

describe("ComparePage", () => {
  it("presents the Memos baseline before routing to every comparison", () => {
    render(<ComparePage />);

    expect(screen.getByRole("heading", { level: 1, name: "How Memos compares." })).toBeInTheDocument();
    expect(screen.getByText("MIT")).toBeInTheDocument();
    expect(screen.getByText("Your server")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();

    const detailLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/compare/"));
    expect(detailLinks).toHaveLength(COMPARISON_SLUGS.length);
    expect(new Set(detailLinks.map((link) => link.getAttribute("href"))).size).toBe(COMPARISON_SLUGS.length);
  });

  it("groups comparisons into anchored chapters by the kind of tool the visitor already uses", () => {
    render(<ComparePage />);

    for (const category of COMPARISON_CATEGORIES) {
      const chapter = screen.getByRole("region", { name: category.title });
      expect(chapter).toHaveAttribute("id", category.key);
      expect(chapter.querySelectorAll('a[href^="/compare/"]')).toHaveLength(getComparisonSlugsByCategory(category.key).length);
    }

    const anchors = screen.getByRole("navigation", { name: "Comparison groups" }).querySelectorAll("a");
    expect(Array.from(anchors).map((anchor) => anchor.getAttribute("href"))).toEqual(
      COMPARISON_CATEGORIES.map((category) => `#${category.key}`),
    );
  });

  it("shows the sponsor and Carbon panels once", () => {
    render(<ComparePage />);

    expect(screen.getAllByTestId("carbon-ad")).toHaveLength(1);
    expect(screen.getByRole("group", { name: "Sponsors" })).toBeInTheDocument();
  });

  it("keeps comparison metadata search-oriented", () => {
    expect(metadata.title).toBe("Compare");
    expect(metadata.description).toContain("Obsidian");
    expect(metadata.alternates?.canonical).toBe("https://usememos.com/compare");
  });
});

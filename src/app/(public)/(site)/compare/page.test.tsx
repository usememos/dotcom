import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COMPARISON_SLUGS } from "@/features/marketing/data/comparisons";
import ComparePage, { metadata } from "./page";

describe("ComparePage", () => {
  it("presents the Memos baseline before routing to every comparison", () => {
    render(<ComparePage />);

    expect(screen.getByRole("heading", { level: 1, name: "How Memos compares." })).toBeInTheDocument();
    expect(screen.getByText("MIT open source")).toBeInTheDocument();
    expect(screen.getByText("Your server")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();

    const detailLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("/compare/"));
    expect(detailLinks).toHaveLength(COMPARISON_SLUGS.length);
  });

  it("keeps comparison metadata search-oriented", () => {
    expect(metadata.title).toBe("Compare");
    expect(metadata.description).toContain("Obsidian");
    expect(metadata.alternates?.canonical).toBe("https://usememos.com/compare");
  });
});

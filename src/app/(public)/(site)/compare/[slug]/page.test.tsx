import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COMPARISON_SLUGS, COMPARISONS } from "@/features/marketing/data/comparisons";
import ComparisonPage, { generateMetadata, generateStaticParams } from "./page";

async function renderComparison(slug: string) {
  render(await ComparisonPage({ params: Promise.resolve({ slug }) }));
}

describe("ComparisonPage", () => {
  it("answers the decision before the full comparison table", async () => {
    await renderComparison("obsidian");

    const verdict = screen.getByText(COMPARISONS.obsidian.summary);
    const table = screen.getByRole("table", { name: "Memos vs Obsidian comparison table" });

    expect(screen.getByRole("heading", { level: 1, name: "Memos vs Obsidian" })).toBeInTheDocument();
    expect(verdict.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Choose Memos when" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Choose Obsidian when" })).toBeInTheDocument();
  });

  it("exposes WIP status on related feature links", async () => {
    await renderComparison("evernote");

    expect(screen.getByRole("link", { name: /Import Work in progress/ })).toHaveAttribute("href", "/features/import");
  });

  it("statically generates every comparison with canonical metadata", async () => {
    const staticParams = await generateStaticParams();
    const pageMetadata = await generateMetadata({ params: Promise.resolve({ slug: "notion" }) });

    expect(staticParams).toHaveLength(COMPARISON_SLUGS.length);
    expect(pageMetadata.alternates?.canonical).toBe("https://usememos.com/compare/notion");
  });
});

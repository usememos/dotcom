import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  COMPARISON_SLUGS,
  COMPARISONS,
  FEATURE_MATRIX_GROUPS,
  FEATURE_MATRIX_ROWS,
  getRelatedComparisonSlugs,
} from "@/features/marketing/data/comparisons";
import ComparisonPage, { generateMetadata, generateStaticParams } from "./page";

vi.mock("@/features/docs/components/ads-section", () => ({
  MainContentAds: () => <div data-testid="main-content-ads" />,
  SidebarAds: () => <div data-testid="sidebar-ads" />,
}));

const pageSource = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "page.tsx"), "utf8");

async function renderComparison(slug: string) {
  render(await ComparisonPage({ params: Promise.resolve({ slug }) }));
}

function readJsonLd(type: string) {
  return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    .map((script) => JSON.parse(script.textContent ?? "{}") as { "@type"?: string })
    .find((data) => data["@type"] === type);
}

describe("ComparisonPage", () => {
  it("answers the decision in the hero before the at-a-glance table and the matrix", async () => {
    await renderComparison("obsidian");

    const verdict = screen.getByText(COMPARISONS.obsidian.summary);
    const table = screen.getByRole("table", { name: "Memos vs Obsidian comparison table" });
    const matrix = screen.getByRole("table", { name: "Memos vs Obsidian feature matrix" });

    expect(screen.getByRole("heading", { level: 1, name: "Memos vs Obsidian" })).toBeInTheDocument();
    expect(verdict.compareDocumentPosition(table) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(table.compareDocumentPosition(matrix) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Choose Memos when" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Choose Obsidian when" })).toBeInTheDocument();
  });

  it("renders the grouped feature matrix with Memos' honest answers and the competitor's sources", async () => {
    await renderComparison("standard-notes");

    const matrix = screen.getByRole("table", { name: "Memos vs Standard Notes feature matrix" });
    const rowLabels = Array.from(matrix.querySelectorAll('th[scope="row"]')).map((cell) => cell.textContent);
    const groupLabels = Array.from(matrix.querySelectorAll('th[scope="rowgroup"]')).map((cell) => cell.textContent);

    expect(rowLabels).toEqual(FEATURE_MATRIX_ROWS.map((row) => row.label));
    expect(groupLabels).toEqual([...FEATURE_MATRIX_GROUPS]);
    expect(within(matrix).getByText("The server you run can read your memos; protect it with TLS and disk encryption")).toBeInTheDocument();
    expect(within(matrix).getAllByText("No.").length).toBeGreaterThan(0);
    expect(within(matrix).getByRole("link", { name: "Source for Standard Notes end-to-end encryption" })).toHaveAttribute(
      "href",
      "https://standardnotes.com/plans",
    );
    expect(screen.getByText("Facts checked October 2026.")).toBeInTheDocument();
  });

  it("keeps the visible FAQ and the FAQPage JSON-LD in sync, one answer open at a time", async () => {
    await renderComparison("apple-notes");

    const faqJsonLd = readJsonLd("FAQPage") as { mainEntity: Array<{ name: string }> } | undefined;
    const rows = Array.from(document.querySelectorAll<HTMLDetailsElement>("details"));

    expect(faqJsonLd?.mainEntity.map((entry) => entry.name)).toEqual(COMPARISONS["apple-notes"].faq.map((item) => item.question));
    expect(rows.map((row) => row.querySelector("summary")?.textContent)).toEqual(
      COMPARISONS["apple-notes"].faq.map((item) => item.question),
    );
    expect(rows.map((row) => row.open)).toEqual(COMPARISONS["apple-notes"].faq.map((_, index) => index === 0));
  });

  it("links to related comparisons without linking to itself, and exposes WIP on feature links", async () => {
    await renderComparison("evernote");

    const related = within(screen.getByRole("region", { name: "More comparisons" })).getAllByRole("link");
    const expected = getRelatedComparisonSlugs("evernote");

    expect(related.map((link) => link.getAttribute("href"))).toEqual(expected.map((slug) => `/compare/${slug}`));
    expect(expected).not.toContain("evernote");
    expect(expected.every((slug) => COMPARISONS[slug].category === "cloud")).toBe(true);
    const importLink = screen.getByRole("region", { name: "Memos in detail" }).querySelector('a[href="/features/import"]');
    expect(importLink).toHaveTextContent("Import");
    expect(importLink).toHaveTextContent("WIP");
  });

  it("mounts each responsive sponsor placement once, beside and after the feature matrix", async () => {
    await renderComparison("notion");

    expect(screen.getAllByTestId("main-content-ads")).toHaveLength(1);
    expect(screen.getAllByTestId("sidebar-ads")).toHaveLength(1);
    expect(pageSource.split("<MainContentAds />")).toHaveLength(2);
    expect(pageSource.split("<SidebarAds />")).toHaveLength(2);
    expect(pageSource.indexOf("<MainContentAds />")).toBeGreaterThan(pageSource.indexOf("<ComparisonFeatureMatrix"));
    expect(pageSource.indexOf("<SidebarAds />")).toBeGreaterThan(pageSource.indexOf("sticky top-24"));
  });

  it("statically generates every comparison with canonical metadata", async () => {
    const staticParams = await generateStaticParams();
    const pageMetadata = await generateMetadata({ params: Promise.resolve({ slug: "notion" }) });

    expect(staticParams).toHaveLength(COMPARISON_SLUGS.length);
    expect(pageMetadata.alternates?.canonical).toBe("https://usememos.com/compare/notion");
  });
});

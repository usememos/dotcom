import { describe, expect, it } from "vitest";
import { isFeatureSlug } from "@/features/marketing/data/features";
import {
  COMPARISON_CATEGORIES,
  COMPARISON_SLUGS,
  COMPARISONS,
  FEATURE_MATRIX_ROWS,
  getComparisonSlugsByCategory,
  getRelatedComparisonSlugs,
  MEMOS_MATRIX,
} from "./index";

const entries = COMPARISON_SLUGS.map((slug) => [slug, COMPARISONS[slug]] as const);

describe("comparison catalog", () => {
  it.each(entries)("%s links only to real feature pages and keeps its SEO fields complete", (_slug, comparison) => {
    for (const feature of comparison.features) {
      expect(isFeatureSlug(feature.slug), `${feature.slug} is not a feature page`).toBe(true);
    }

    expect(comparison.seo.title).not.toMatch(/\s-\sMemos$/);
    expect(comparison.seo.title.length).toBeLessThanOrEqual(70);
    expect(comparison.seo.description.length).toBeLessThanOrEqual(170);
    expect(comparison.seo.keywords.length).toBeGreaterThanOrEqual(4);
    expect(comparison.rows.length).toBeGreaterThanOrEqual(6);
    expect(comparison.chooseMemos).toHaveLength(3);
    expect(comparison.chooseCompetitor).toHaveLength(3);
  });

  it.each(entries)("%s answers every matrix row with a reviewed date and at least three FAQs", (_slug, comparison) => {
    for (const row of FEATURE_MATRIX_ROWS) {
      const cell = comparison.matrix[row.key];
      expect(cell.detail.trim().length, `${row.key} detail`).toBeGreaterThan(0);
      if (cell.source) {
        expect(cell.source).toMatch(/^https:\/\//);
      }
    }

    expect(comparison.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(new Date(comparison.reviewedAt).getTime())).toBe(false);
    expect(comparison.faq.length).toBeGreaterThanOrEqual(3);
    for (const item of comparison.faq) {
      expect(item.question.endsWith("?")).toBe(true);
      expect(item.answer.length).toBeGreaterThan(40);
    }
  });

  it("keeps Memos' column honest on the rows it does not win", () => {
    expect(MEMOS_MATRIX.e2ee.support).toBe("no");
    expect(MEMOS_MATRIX.offline.support).toBe("no");
    expect(MEMOS_MATRIX.hostedService.support).toBe("no");
    expect(MEMOS_MATRIX.importExport.support).toBe("partial");
  });

  it("assigns every comparison to exactly one index category", () => {
    const grouped = COMPARISON_CATEGORIES.flatMap((category) => getComparisonSlugsByCategory(category.key));

    expect([...grouped].sort()).toEqual([...COMPARISON_SLUGS].sort());
    for (const category of COMPARISON_CATEGORIES) {
      expect(getComparisonSlugsByCategory(category.key).length).toBeGreaterThan(0);
    }
  });

  it("recommends same-category siblings first and never the page itself", () => {
    for (const slug of COMPARISON_SLUGS) {
      const related = getRelatedComparisonSlugs(slug);
      expect(related).toHaveLength(3);
      expect(related).not.toContain(slug);
      expect(new Set(related).size).toBe(3);
    }

    expect(getRelatedComparisonSlugs("obsidian")).toEqual(["logseq", "bear", "anytype"]);
  });
});

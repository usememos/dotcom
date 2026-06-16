import { COMPARISONS } from "./data";
import { COMPARISON_SLUGS } from "./slugs";
import type { ComparisonDefinition, ComparisonSlug } from "./types";

export type { ComparisonDefinition, ComparisonSlug };
export { COMPARISON_SLUGS, COMPARISONS };

const COMPARISON_SLUG_SET = new Set<string>(COMPARISON_SLUGS);

export function isComparisonSlug(slug: string): slug is ComparisonSlug {
  return COMPARISON_SLUG_SET.has(slug);
}

export function getComparison(slug: string): ComparisonDefinition | null {
  return isComparisonSlug(slug) ? COMPARISONS[slug] : null;
}

export function getAllComparisonSlugs(): readonly ComparisonSlug[] {
  return COMPARISON_SLUGS;
}

import { COMPARISONS } from "./data";
import { FEATURE_MATRIX_GROUPS, FEATURE_MATRIX_ROWS, type FeatureMatrixGroup, MEMOS_MATRIX } from "./matrix";
import { COMPARISON_SLUGS } from "./slugs";
import type { ComparisonCategory, ComparisonDefinition, ComparisonSlug, FeatureCell, FeatureMatrixKey, FeatureSupport } from "./types";

export type { ComparisonCategory, ComparisonDefinition, ComparisonSlug, FeatureCell, FeatureMatrixGroup, FeatureMatrixKey, FeatureSupport };
export { COMPARISON_SLUGS, COMPARISONS, FEATURE_MATRIX_GROUPS, FEATURE_MATRIX_ROWS, MEMOS_MATRIX };

const COMPARISON_SLUG_SET = new Set<string>(COMPARISON_SLUGS);

export interface ComparisonCategoryDefinition {
  key: ComparisonCategory;
  /** Short chapter eyebrow and anchor label, e.g. "Cloud apps". */
  eyebrow: string;
  /** The chapter thesis for this group. */
  title: string;
  description: string;
}

/** Index-page chapters, in display order, named by the kind of tool the visitor already uses. */
export const COMPARISON_CATEGORIES: readonly ComparisonCategoryDefinition[] = [
  {
    key: "cloud",
    eyebrow: "Cloud apps",
    title: "Keep the habit. Leave the account.",
    description: "Hosted services you sign in to. Memos keeps the same quick notes on a server you run.",
  },
  {
    key: "local-first",
    eyebrow: "Local-first apps",
    title: "One server instead of files on every device.",
    description:
      "Vaults and Markdown files that live on your devices. Memos moves the source of truth to one instance you open in any browser.",
  },
  {
    key: "self-hosted",
    eyebrow: "Self-hosted peers",
    title: "The closest neighbors, compared honestly.",
    description: "Open-source apps you can also run yourself. The differences are shape, encryption, and how much you have to operate.",
  },
];

export function isComparisonSlug(slug: string): slug is ComparisonSlug {
  return COMPARISON_SLUG_SET.has(slug);
}

export function getComparison(slug: string): ComparisonDefinition | null {
  return isComparisonSlug(slug) ? COMPARISONS[slug] : null;
}

export function getAllComparisonSlugs(): readonly ComparisonSlug[] {
  return COMPARISON_SLUGS;
}

export function getComparisonSlugsByCategory(category: ComparisonCategory): ComparisonSlug[] {
  return COMPARISON_SLUGS.filter((slug) => COMPARISONS[slug].category === category);
}

/** Same-category siblings first, then the rest of the catalog, never the page itself. */
export function getRelatedComparisonSlugs(slug: ComparisonSlug, limit = 3): ComparisonSlug[] {
  const category = COMPARISONS[slug].category;
  const siblings = COMPARISON_SLUGS.filter((candidate) => candidate !== slug && COMPARISONS[candidate].category === category);
  const others = COMPARISON_SLUGS.filter((candidate) => candidate !== slug && COMPARISONS[candidate].category !== category);
  return [...siblings, ...others].slice(0, limit);
}

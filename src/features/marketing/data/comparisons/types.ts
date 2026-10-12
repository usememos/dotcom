import type { LucideIcon } from "lucide-react";
import type { FaqItem } from "@/shared/lib/seo";
import type { FEATURE_MATRIX_ROWS } from "./matrix";
import type { COMPARISON_SLUGS } from "./slugs";

export interface ComparisonRow {
  /** The dimension being compared, e.g. "Hosting" or "License". */
  label: string;
  /** Memos' value for this dimension. */
  memos: string;
  /** The competitor's value for this dimension. */
  competitor: string;
}

/** How well a product covers a feature-matrix row. Omit for descriptive rows such as price. */
export type FeatureSupport = "yes" | "partial" | "no";

export interface FeatureCell {
  support?: FeatureSupport;
  /** Short, factual detail shown next to the support mark. */
  detail: string;
  /** Optional public page that backs the claim; rendered as a footnote link. */
  source?: string;
}

export type FeatureMatrixKey = (typeof FEATURE_MATRIX_ROWS)[number]["key"];

export type FeatureMatrix = Record<FeatureMatrixKey, FeatureCell>;

/** Groups the index page uses so a visitor can find the shape of tool they already know. */
export type ComparisonCategory = "cloud" | "local-first" | "self-hosted";

export interface ComparisonDefinition {
  /** Display name of the competitor, e.g. "Obsidian". */
  competitor: string;
  /** Page H1, e.g. "Memos vs Obsidian". */
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  category: ComparisonCategory;
  /** ISO date (YYYY-MM-DD) the facts were last checked; shown on the page and used as sitemap lastmod. */
  reviewedAt: string;
  /** One-paragraph honest "short version" of the verdict. */
  summary: string;
  /** Side-by-side comparison table rows. */
  rows: ComparisonRow[];
  /** The competitor's cells for the shared feature matrix; Memos' cells live in `matrix.ts`. */
  matrix: FeatureMatrix;
  /** Honest "choose Memos when..." bullets. */
  chooseMemos: string[];
  /** Honest "choose the other tool when..." bullets. */
  chooseCompetitor: string[];
  /** Related Memos features; slug must resolve to a real /features/<slug> page. */
  features: Array<{
    name: string;
    slug: string;
  }>;
  /** Visible Q&A that also feeds the FAQPage JSON-LD. */
  faq: readonly FaqItem[];
  seo: {
    /** Full, self-contained SERP title (used as an absolute title). */
    title: string;
    description: string;
    keywords: string[];
  };
}

export type ComparisonSlug = (typeof COMPARISON_SLUGS)[number];

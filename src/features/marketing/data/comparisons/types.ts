import type { LucideIcon } from "lucide-react";
import type { COMPARISON_SLUGS } from "./slugs";

export interface ComparisonRow {
  /** The dimension being compared, e.g. "Hosting" or "License". */
  label: string;
  /** Memos' value for this dimension. */
  memos: string;
  /** The competitor's value for this dimension. */
  competitor: string;
}

export interface ComparisonDefinition {
  /** Display name of the competitor, e.g. "Obsidian". */
  competitor: string;
  /** Page H1, e.g. "Memos vs Obsidian". */
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  /** One-paragraph honest "short version" of the verdict. */
  summary: string;
  /** Side-by-side comparison table rows. */
  rows: ComparisonRow[];
  /** Honest "choose Memos when..." bullets. */
  chooseMemos: string[];
  /** Honest "choose the other tool when..." bullets. */
  chooseCompetitor: string[];
  /** Related Memos features; slug must resolve to a real /features/<slug> page. */
  features: Array<{
    name: string;
    slug: string;
  }>;
  seo: {
    /** Full, self-contained SERP title (used as an absolute title). */
    title: string;
    description: string;
    keywords: string[];
  };
}

export type ComparisonSlug = (typeof COMPARISON_SLUGS)[number];

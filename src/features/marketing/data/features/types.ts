import type { LucideIcon } from "lucide-react";
import type { FEATURE_SLUGS } from "./slugs";

/** A documentation page that explains how to use or set up a feature. */
export interface FeatureDocLink {
  label: string;
  href: `/docs${string}`;
}

export interface FeatureDefinition {
  title: string;
  /**
   * Browser and search-result title, used in place of "{title} Feature". Name
   * what the page covers in the words people search for; the layout appends
   * " - Memos". Leave unset for WIP features.
   */
  searchTitle?: string;
  description: string;
  /** Docs pages listed under "Further reading". Each must be an existing docs route. */
  docs?: readonly FeatureDocLink[];
  icon: LucideIcon;
  wip?: boolean;
  hero: {
    title: string;
    subtitle: string;
  };
  benefits: string[];
  useCases: Array<{
    title: string;
    description: string;
  }>;
  techDetails: string[];
}

export type FeatureSlug = (typeof FEATURE_SLUGS)[number];

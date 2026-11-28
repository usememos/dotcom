import type { LucideIcon } from "lucide-react";
import type { FEATURE_SLUGS } from "./slugs";

export interface FeatureDefinition {
  title: string;
  /**
   * Browser and search-result title, used in place of "{title} Feature". Name
   * what the page covers in the words people search for; the layout appends
   * " - Memos". Leave unset for WIP features.
   */
  searchTitle?: string;
  description: string;
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

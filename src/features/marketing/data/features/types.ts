import type { LucideIcon } from "lucide-react";
import type { FEATURE_SLUGS } from "./slugs";

export interface FeatureDefinition {
  title: string;
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

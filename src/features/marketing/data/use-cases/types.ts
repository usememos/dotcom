import type { LucideIcon } from "lucide-react";
import type { USE_CASE_SLUGS } from "./slugs";

export interface UseCaseDefinition {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  workflows: string[];
  whyMemos: string[];
  features: Array<{
    name: string;
    slug: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

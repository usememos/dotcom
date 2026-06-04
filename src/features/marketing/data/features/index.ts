import { FEATURES } from "./data";
import { FEATURE_SLUGS } from "./slugs";
import type { FeatureDefinition, FeatureSlug } from "./types";

export type { FeatureDefinition, FeatureSlug };
export { FEATURE_SLUGS, FEATURES };

const FEATURE_SLUG_SET = new Set<string>(FEATURE_SLUGS);

export function isFeatureSlug(slug: string): slug is FeatureSlug {
  return FEATURE_SLUG_SET.has(slug);
}

export function getFeature(slug: string): FeatureDefinition | null {
  return isFeatureSlug(slug) ? FEATURES[slug] : null;
}

export function getAllFeatureSlugs(): readonly FeatureSlug[] {
  return FEATURE_SLUGS;
}

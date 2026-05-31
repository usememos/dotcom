import { FEATURES } from "./data";
import { FEATURE_SLUGS } from "./slugs";
import type { FeatureDefinition, FeatureSlug } from "./types";

export type { FeatureDefinition, FeatureSlug };
export { FEATURE_SLUGS, FEATURES };

/**
 * Get feature definition by slug
 */
export function getFeature(slug: string): FeatureDefinition | null {
  return FEATURES[slug as FeatureSlug] || null;
}

/**
 * Get all feature slugs for static generation
 */
export function getAllFeatureSlugs(): readonly FeatureSlug[] {
  return FEATURE_SLUGS;
}

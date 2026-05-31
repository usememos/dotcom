import { USE_CASES } from "./data";
import { USE_CASE_SLUGS } from "./slugs";
import type { UseCaseDefinition, UseCaseSlug } from "./types";

export type { UseCaseDefinition, UseCaseSlug };
export { USE_CASE_SLUGS, USE_CASES };

/**
 * Get use case definition by slug
 */
export function getUseCase(slug: string): UseCaseDefinition | null {
  return USE_CASES[slug as UseCaseSlug] || null;
}

/**
 * Get all use case slugs for static generation
 */
export function getAllUseCaseSlugs(): readonly UseCaseSlug[] {
  return USE_CASE_SLUGS;
}

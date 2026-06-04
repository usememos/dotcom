import { USE_CASES } from "./data";
import { USE_CASE_SLUGS } from "./slugs";
import type { UseCaseDefinition, UseCaseSlug } from "./types";

export type { UseCaseDefinition, UseCaseSlug };
export { USE_CASE_SLUGS, USE_CASES };

const USE_CASE_SLUG_SET = new Set<string>(USE_CASE_SLUGS);

export function isUseCaseSlug(slug: string): slug is UseCaseSlug {
  return USE_CASE_SLUG_SET.has(slug);
}

export function getUseCase(slug: string): UseCaseDefinition | null {
  return isUseCaseSlug(slug) ? USE_CASES[slug] : null;
}

export function getAllUseCaseSlugs(): readonly UseCaseSlug[] {
  return USE_CASE_SLUGS;
}

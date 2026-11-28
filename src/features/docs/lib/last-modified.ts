/**
 * Git last-modified date of a docs page, when the build recorded one.
 *
 * `source.config.ts` enables the dates only when the checkout has full Git
 * history, so the generated page type has a `lastModified` field in some
 * builds (local) and not in others (shallow CI clones). Reading it through
 * this helper keeps both type-checking.
 */
export function getDocLastModified(data: object): Date | undefined {
  const value = (data as { lastModified?: unknown }).lastModified;
  return value instanceof Date ? value : undefined;
}

import apiDocsVersionsData from "./api-docs-versions.json";

export interface ApiDocsVersion {
  slug: string;
  label: string;
  sourceRef: string;
  snapshotVersion: string;
  legacySlugs?: string[];
  isLatest?: boolean;
  archived?: boolean;
}

const apiDocsVersionManifest = apiDocsVersionsData as ApiDocsVersion[];

/** The three API reference versions published on usememos.com. */
export const apiDocsVersions = apiDocsVersionManifest.filter((version) => !version.archived);

export const latestApiDocsVersion = apiDocsVersions.find((version) => version.isLatest)?.slug ?? apiDocsVersions[0]?.slug ?? "latest";

export function isApiDocsVersion(slug?: string): slug is string {
  return Boolean(slug && apiDocsVersions.some((version) => version.slug === slug));
}

/** Includes published versions and retained historical snapshot slugs. */
export function isKnownApiDocsVersion(slug?: string): slug is string {
  return Boolean(slug && apiDocsVersionManifest.some((version) => version.slug === slug));
}

export function getApiDocsVersionLabel(slug?: string): string {
  return apiDocsVersions.find((version) => version.slug === slug)?.label ?? slug ?? latestApiDocsVersion;
}

export function getApiDocsVersionPath(version: string, segments: string[] = []): string {
  const suffix = segments.length > 0 ? `/${segments.join("/")}` : "";
  return `/docs/api/${version}${suffix}`;
}

/**
 * Search should index the current API reference without mixing near-identical
 * historical snapshots into every result set. Non-API documentation and the
 * versionless API landing path remain searchable.
 */
export function isSearchableDocsPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "docs" || segments[1] !== "api" || !isKnownApiDocsVersion(segments[2])) {
    return true;
  }

  return segments[2] === latestApiDocsVersion;
}

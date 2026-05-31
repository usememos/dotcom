import apiDocsVersionsData from "./api-docs-versions.json";

export interface ApiDocsVersion {
  slug: string;
  label: string;
  ref: string;
  isLatest?: boolean;
}

export const apiDocsVersions = apiDocsVersionsData as ApiDocsVersion[];

export const latestApiDocsVersion = apiDocsVersions.find((version) => version.isLatest)?.slug ?? apiDocsVersions[0]?.slug ?? "latest";

export function isApiDocsVersion(slug?: string): slug is string {
  return Boolean(slug && apiDocsVersions.some((version) => version.slug === slug));
}

export function getApiDocsVersionLabel(slug?: string): string {
  return apiDocsVersions.find((version) => version.slug === slug)?.label ?? slug ?? latestApiDocsVersion;
}

export function getApiDocsVersionFromSlug(slug: string[]): string {
  return isApiDocsVersion(slug[1]) ? slug[1] : latestApiDocsVersion;
}

export function getApiDocsVersionFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "docs" || segments[1] !== "api") {
    return latestApiDocsVersion;
  }

  return isApiDocsVersion(segments[2]) ? segments[2] : latestApiDocsVersion;
}

export function normalizeApiDocsSlug(slug: string[]): string[] {
  if (slug[0] !== "api") {
    return slug;
  }

  if (isApiDocsVersion(slug[1])) {
    return slug;
  }

  return ["api", latestApiDocsVersion, ...slug.slice(1)];
}

export function getApiDocsVersionPath(version: string, segments: string[] = []): string {
  const suffix = segments.length > 0 ? `/${segments.join("/")}` : "";
  return `/docs/api/${version}${suffix}`;
}

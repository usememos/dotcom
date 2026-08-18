import { describe, expect, it } from "vitest";
import { apiDocsVersions, isApiDocsVersion, isKnownApiDocsVersion, isSearchableDocsPath, latestApiDocsVersion } from "./api-docs";

describe("apiDocsVersions", () => {
  it("exposes only the three published API references", () => {
    expect(apiDocsVersions).toHaveLength(3);
    expect(apiDocsVersions.map((version) => version.slug)).toEqual(["latest", "0-30", "0-29"]);
  });

  it("does not treat archived snapshots as public routes", () => {
    expect(isApiDocsVersion("0-28")).toBe(false);
    expect(isKnownApiDocsVersion("0-28")).toBe(true);
  });
});

describe("isSearchableDocsPath", () => {
  it("keeps regular documentation and the API landing page searchable", () => {
    expect(isSearchableDocsPath("/docs/usage/writing-markdown")).toBe(true);
    expect(isSearchableDocsPath("/docs/api")).toBe(true);
  });

  it("keeps the latest API reference searchable", () => {
    expect(isSearchableDocsPath(`/docs/api/${latestApiDocsVersion}`)).toBe(true);
    expect(isSearchableDocsPath(`/docs/api/${latestApiDocsVersion}/memoservice/ListMemos`)).toBe(true);
  });

  it("excludes historical API snapshots", () => {
    expect(isSearchableDocsPath("/docs/api/0-30")).toBe(false);
    expect(isSearchableDocsPath("/docs/api/0-29/memoservice/ListMemos")).toBe(false);
    expect(isSearchableDocsPath("/docs/api/0-28/memoservice/ListMemos")).toBe(false);
  });
});

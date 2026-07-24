import { describe, expect, it } from "vitest";
import { isSearchableDocsPath, latestApiDocsVersion } from "./api-docs";

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
  });
});

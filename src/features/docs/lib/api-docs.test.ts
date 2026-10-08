import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { apiDocsVersions, isApiDocsVersion, isKnownApiDocsVersion, isSearchableDocsPath, latestApiDocsVersion } from "./api-docs";

describe("apiDocsVersions", () => {
  it("exposes only the three published API references", () => {
    expect(apiDocsVersions).toHaveLength(3);
    expect(apiDocsVersions.map((version) => version.slug)).toEqual(["latest", "0-31", "0-30"]);
  });

  it("does not treat archived snapshots as public routes", () => {
    expect(isApiDocsVersion("0-29")).toBe(false);
    expect(isKnownApiDocsVersion("0-29")).toBe(true);
    expect(isApiDocsVersion("0-28")).toBe(false);
    expect(isKnownApiDocsVersion("0-28")).toBe(true);
  });

  it("uses each published snapshot's API path in the schema and overview", () => {
    for (const version of apiDocsVersions) {
      const schema = readFileSync(join(process.cwd(), "openapi", `${version.slug}.yaml`), "utf8");
      const overview = readFileSync(join(process.cwd(), "content/docs/api", version.slug, "index.mdx"), "utf8");
      const paths = [...schema.matchAll(/^ {4}(\/api\/[^\n]+):$/gm)].map((match) => match[1]);

      expect(paths.length).toBeGreaterThan(0);
      expect(paths.every((path) => path.startsWith(`${version.apiBasePath}/`))).toBe(true);
      expect(overview).toContain(`https://your-memos-instance.com${version.apiBasePath}`);
      expect(overview).toContain(`https://your-memos-instance.com${version.apiBasePath}/memos?pageSize=10`);
      expect(schema).toContain(version.isLatest ? "url: '{instanceUrl}'" : "url: https://demo.usememos.com");
    }
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
    expect(isSearchableDocsPath("/docs/api/0-31/memoservice/ListMemos")).toBe(false);
    expect(isSearchableDocsPath("/docs/api/0-30")).toBe(false);
    expect(isSearchableDocsPath("/docs/api/0-29/memoservice/ListMemos")).toBe(false);
    expect(isSearchableDocsPath("/docs/api/0-28/memoservice/ListMemos")).toBe(false);
  });
});

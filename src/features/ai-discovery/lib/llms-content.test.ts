import { describe, expect, it } from "vitest";
import { buildLlmsFull, buildLlmsIndex, buildMarkdownDocument, isApiDocsUrl, type PageMeta, parseMarkdownSlug } from "./llms-content";

const indexInput: { docs: PageMeta[]; blog: PageMeta[]; changelog: PageMeta[] } = {
  docs: [
    { url: "/docs/getting-started", title: "Getting Started", description: "Install Memos." },
    { url: "/docs/api/latest/memoservice/GetMemo", title: "GetMemo", description: "API endpoint." },
  ],
  blog: [{ url: "/blog/hello", title: "Hello", description: "First post." }],
  changelog: [{ url: "/changelog/0-29-0", title: "0.29.0", description: "Release notes." }],
};

describe("buildLlmsIndex", () => {
  const output = buildLlmsIndex(indexInput);

  it("starts with the site heading and summary", () => {
    expect(output.startsWith("# Memos\n")).toBe(true);
    expect(output).toContain("> Memos is an open-source, self-hosted note-taking app");
  });

  it("includes every section heading", () => {
    for (const heading of ["## Docs", "## API", "## Features", "## Compare", "## Use Cases", "## Blog", "## Changelog"]) {
      expect(output).toContain(heading);
    }
  });

  it("emits absolute URLs and the curated comparison pages", () => {
    expect(output).toContain("https://usememos.com/docs/getting-started");
    expect(output).toContain("https://usememos.com/compare/obsidian");
  });

  it("excludes API reference pages from the docs list but links the reference once", () => {
    expect(output).not.toContain("/docs/api/latest/memoservice/GetMemo");
    expect(output).toContain("https://usememos.com/docs/api/latest)");
  });
});

describe("parseMarkdownSlug", () => {
  it("maps known content sections", () => {
    expect(parseMarkdownSlug(["docs", "getting-started"])).toEqual({ section: "docs", rest: ["getting-started"] });
    expect(parseMarkdownSlug(["blog", "hello"])).toEqual({ section: "blog", rest: ["hello"] });
    expect(parseMarkdownSlug(["docs"])).toEqual({ section: "docs", rest: [] });
  });

  it("rejects empty, unknown, and API slugs", () => {
    expect(parseMarkdownSlug([])).toBeNull();
    expect(parseMarkdownSlug(["features", "tags"])).toBeNull();
    expect(parseMarkdownSlug(["docs", "api", "latest"])).toBeNull();
  });
});

describe("markdown document builders", () => {
  it("buildMarkdownDocument prefixes title and canonical URL", () => {
    const doc = buildMarkdownDocument({ url: "/docs/getting-started", title: "Getting Started", markdown: "Body text.\n" });
    expect(doc).toBe("# Getting Started\nURL: https://usememos.com/docs/getting-started\n\nBody text.\n");
  });

  it("buildLlmsFull concatenates documents with separators", () => {
    const full = buildLlmsFull([
      { url: "/docs/a", title: "A", markdown: "Alpha." },
      { url: "/blog/b", title: "B", markdown: "Beta." },
    ]);
    expect(full).toContain("# Memos — Full content");
    expect(full).toContain("URL: https://usememos.com/docs/a");
    expect(full).toContain("URL: https://usememos.com/blog/b");
    expect(full).toContain("\n---\n");
  });
});

describe("isApiDocsUrl", () => {
  it("matches the API index and its descendants only", () => {
    expect(isApiDocsUrl("/docs/api")).toBe(true);
    expect(isApiDocsUrl("/docs/api/latest/x")).toBe(true);
    expect(isApiDocsUrl("/docs/getting-started")).toBe(false);
  });
});

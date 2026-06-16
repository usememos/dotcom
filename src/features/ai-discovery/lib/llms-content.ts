import { COMPARISONS, getAllComparisonSlugs } from "@/features/marketing/data/comparisons";
import { FEATURES, getAllFeatureSlugs } from "@/features/marketing/data/features";
import { getAllUseCaseSlugs, USE_CASES } from "@/features/marketing/data/use-cases";
import { absoluteUrl, SITE_NAME } from "@/shared/lib/seo";

/**
 * Pure builders for the AI discovery surface (/llms.txt, /llms-full.txt,
 * /llms.mdx/*). All fumadocs/filesystem access lives in llms-sources.ts; this
 * module takes plain data so it stays trivially testable.
 */

export const LLMS_SUMMARY =
  "Memos is an open-source, self-hosted note-taking app — a Markdown-native timeline for quick notes, daily logs, links, and snippets. Self-host with Docker; private and free.";

export interface PageMeta {
  url: string;
  title: string;
  description?: string;
}

export interface PageContent extends PageMeta {
  markdown: string;
}

export type ContentSection = "docs" | "blog" | "changelog";

const CONTENT_SECTIONS: readonly ContentSection[] = ["docs", "blog", "changelog"];

/** The auto-generated API reference is excluded from Markdown dumps (too large, low signal). */
export function isApiDocsUrl(url: string): boolean {
  return url === "/docs/api" || url.startsWith("/docs/api/");
}

function formatLine(title: string, url: string, description?: string): string {
  const base = `- [${title}](${absoluteUrl(url)})`;
  const desc = description?.replace(/\s+/g, " ").trim();
  return desc ? `${base}: ${desc}` : base;
}

function sectionLines(heading: string, lines: string[]): string[] {
  return lines.length > 0 ? [`## ${heading}`, "", ...lines, ""] : [];
}

export function buildLlmsIndex(input: { docs: PageMeta[]; blog: PageMeta[]; changelog: PageMeta[] }): string {
  const out: string[] = [`# ${SITE_NAME}`, "", `> ${LLMS_SUMMARY}`, ""];

  out.push(
    ...sectionLines(
      "Docs",
      input.docs.filter((page) => !isApiDocsUrl(page.url)).map((page) => formatLine(page.title, page.url, page.description)),
    ),
  );

  out.push(
    ...sectionLines("API", [formatLine("API Reference", "/docs/api/latest", "REST and gRPC API reference for the latest Memos release.")]),
  );

  out.push(
    ...sectionLines("Features", [
      formatLine(
        "Features overview",
        "/features",
        "Everything Memos does: quick capture, Markdown, tags, search, and self-hosted ownership.",
      ),
      ...getAllFeatureSlugs().map((slug) => formatLine(FEATURES[slug].title, `/features/${slug}`, FEATURES[slug].description)),
    ]),
  );

  out.push(
    ...sectionLines("Compare", [
      formatLine("Compare Memos", "/compare", "How Memos compares to popular note apps, and when to choose each."),
      ...getAllComparisonSlugs().map((slug) => formatLine(COMPARISONS[slug].title, `/compare/${slug}`, COMPARISONS[slug].seo.description)),
    ]),
  );

  out.push(
    ...sectionLines("Use Cases", [
      formatLine("Use cases", "/use-cases", "Common ways people use Memos."),
      ...getAllUseCaseSlugs().map((slug) =>
        formatLine(`${USE_CASES[slug].title} use case`, `/use-cases/${slug}`, USE_CASES[slug].seo.description),
      ),
    ]),
  );

  out.push(
    ...sectionLines(
      "Blog",
      input.blog.map((page) => formatLine(page.title, page.url, page.description)),
    ),
  );
  out.push(
    ...sectionLines(
      "Changelog",
      input.changelog.map((page) => formatLine(page.title, page.url, page.description)),
    ),
  );

  return `${out.join("\n").trimEnd()}\n`;
}

export function buildMarkdownDocument(page: PageContent): string {
  return `# ${page.title}\nURL: ${absoluteUrl(page.url)}\n\n${page.markdown.trim()}\n`;
}

export function buildLlmsFull(pages: PageContent[]): string {
  const header = `# ${SITE_NAME} — Full content\n\n> ${LLMS_SUMMARY}\n`;
  const body = pages.map(buildMarkdownDocument).join("\n---\n\n");
  return `${header}\n${body.trimEnd()}\n`;
}

/**
 * Resolve a `/llms.mdx/<slug>` request to a content section + page slug.
 * Returns null for unknown sections and for the excluded API reference.
 */
export function parseMarkdownSlug(slug: string[]): { section: ContentSection; rest: string[] } | null {
  if (slug.length === 0) {
    return null;
  }

  const [section, ...rest] = slug;
  if (!CONTENT_SECTIONS.includes(section as ContentSection)) {
    return null;
  }

  if (section === "docs" && rest[0] === "api") {
    return null;
  }

  return { section: section as ContentSection, rest };
}

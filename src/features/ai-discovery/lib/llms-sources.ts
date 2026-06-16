import { blogSource, changelogSource, source } from "@/shared/content/source";
import { buildMarkdownDocument, isApiDocsUrl, type PageContent, type PageMeta, parseMarkdownSlug } from "./llms-content";

/**
 * Adapter between fumadocs content sources and the pure builders in
 * llms-content.ts. Everything here reads the generated source / filesystem and
 * runs at build time (the AI routes are force-static).
 */

interface SourcePage {
  url: string;
  data: {
    title?: string;
    description?: string;
    getText: (type: "raw" | "processed") => Promise<string>;
  };
}

function byUrl(a: SourcePage, b: SourcePage): number {
  return a.url.localeCompare(b.url);
}

function toMeta(page: SourcePage): PageMeta {
  return { url: page.url, title: page.data.title ?? page.url, description: page.data.description };
}

async function toContent(page: SourcePage): Promise<PageContent> {
  return {
    url: page.url,
    title: page.data.title ?? page.url,
    description: page.data.description,
    markdown: await page.data.getText("processed"),
  };
}

function docsPages(): SourcePage[] {
  return (source.getPages() as SourcePage[]).filter((page) => !isApiDocsUrl(page.url)).sort(byUrl);
}

function blogPages(): SourcePage[] {
  return (blogSource.getPages() as SourcePage[]).slice().sort(byUrl);
}

function changelogPages(): SourcePage[] {
  return (changelogSource.getPages() as SourcePage[]).slice().sort(byUrl);
}

function allContentPages(): SourcePage[] {
  return [...docsPages(), ...blogPages(), ...changelogPages()];
}

export function getLlmsIndexInput(): { docs: PageMeta[]; blog: PageMeta[]; changelog: PageMeta[] } {
  return {
    docs: docsPages().map(toMeta),
    blog: blogPages().map(toMeta),
    changelog: changelogPages().map(toMeta),
  };
}

export function getMarkdownPageParams(): { slug: string[] }[] {
  return allContentPages().map((page) => ({ slug: page.url.split("/").filter(Boolean) }));
}

export async function getAllContentPages(): Promise<PageContent[]> {
  return Promise.all(allContentPages().map(toContent));
}

export async function getContentMarkdown(slug: string[]): Promise<string | null> {
  const parsed = parseMarkdownSlug(slug);
  if (!parsed) {
    return null;
  }

  const sectionSource = parsed.section === "docs" ? source : parsed.section === "blog" ? blogSource : changelogSource;
  const page = sectionSource.getPage(parsed.rest) as SourcePage | undefined;
  if (!page) {
    return null;
  }

  return buildMarkdownDocument(await toContent(page));
}

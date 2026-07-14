import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdsSectionMobile } from "@/features/docs/components/ads-section";
import { DocsArticleBody } from "@/features/docs/components/docs-article-body";
import { MarkdownCopyButton, ViewOptionsPopover } from "@/features/docs/components/page-actions";
import {
  getApiDocsVersionFromSlug,
  getApiDocsVersionLabel,
  latestApiDocsVersion,
  normalizeApiDocsSlug,
} from "@/features/docs/lib/api-docs";
import { getDocsSocialPreview } from "@/features/docs/lib/social-preview";
import { tocConfig } from "@/features/docs/lib/toc-config";
import { getMDXComponents } from "@/mdx-components";
import { buildContentMetadata } from "@/shared/content/social-preview";
import { source } from "@/shared/content/source";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd } from "@/shared/lib/seo";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
// Every docs URL is known from the file/OpenAPI sources at build time. Reject
// unknown slugs at the route boundary instead of loading the large MDX/OpenAPI
// module to discover the page is missing at request time.
export const dynamicParams = false;

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const normalizedSlug = normalizeApiDocsSlug(params.slug);

  if (normalizedSlug.join("/") !== params.slug.join("/")) {
    redirect(`/docs/${normalizedSlug.join("/")}`);
  }

  const page = source.getPage(normalizedSlug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const isApi = page.url.startsWith("/docs/api");
  // Clean Markdown is served from /llms.mdx/* for prose docs only; API reference
  // pages are excluded from that route, so their page actions would 404.
  const markdownUrl = isApi ? undefined : `/llms.mdx${page.url}`;
  const apiVersion = isApi ? getApiDocsVersionFromSlug(normalizedSlug) : undefined;
  const apiVersionLabel = apiVersion ? getApiDocsVersionLabel(apiVersion) : undefined;

  // For API pages, don't pass empty TOC - let fumadocs-openapi generate it
  // Also don't use full-width layout for API pages to show TOC
  const tocProps = isApi && (!page.data.toc || page.data.toc.length === 0) ? {} : { toc: page.data.toc };
  const fullProp = isApi ? {} : { full: page.data.full };

  // Build breadcrumb items from URL path
  const pathParts = page.url.split("/").filter(Boolean);
  const uiBreadcrumbItems = buildBreadcrumbItems(
    pathParts.map((part, index) => {
      const path = `/${pathParts.slice(0, index + 1).join("/")}`;
      const name =
        index === pathParts.length - 1
          ? page.data.title
          : index === 0
            ? "Documentation"
            : index === 1
              ? "API"
              : index === 2 && apiVersionLabel
                ? apiVersionLabel
                : part.charAt(0).toUpperCase() + part.slice(1);

      return { href: path, name };
    }),
  );
  const breadcrumbItems = uiBreadcrumbItems.map((item) => ({
    href: item.href,
    name: item.name,
  }));
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  const jsonLd = isApi
    ? {
        "@context": "https://schema.org",
        "@type": "APIReference",
        name: page.data.title,
        description: page.data.description,
        url: `https://usememos.com${page.url}`,
        assemblyVersion: apiVersionLabel ?? "latest",
        executableLibraryName: "Memos API",
      }
    : {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: page.data.title,
        description: page.data.description,
        url: `https://usememos.com${page.url}`,
        author: {
          "@type": "Organization",
          name: "Memos Team",
        },
      };

  return (
    <DocsPage {...fullProp} {...tocProps} {...tocConfig}>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {markdownUrl && (
        <div className="mb-4 flex flex-row flex-wrap items-center gap-2">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} />
        </div>
      )}
      <DocsArticleBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsArticleBody>
      <AdsSectionMobile />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams().filter((param) => param.slug && param.slug.length > 0);
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const normalizedSlug = normalizeApiDocsSlug(params.slug);
  const page = source.getPage(normalizedSlug);
  if (!page) notFound();

  const preview = getDocsSocialPreview(page);
  const metadata = buildContentMetadata(preview, {
    title: page.data.title,
    type: "article",
  });

  const isApi = normalizedSlug[0] === "api";

  // Advertise the clean Markdown version of prose docs for AI crawlers.
  if (!isApi) {
    metadata.alternates = {
      canonical: preview.url,
      types: {
        "text/markdown": `https://usememos.com/llms.mdx${page.url}`,
      },
    };
  }

  // Keep only the "latest" API reference indexable. Older version snapshots are
  // near-duplicates that dilute crawl budget and split ranking authority, so we
  // noindex them while still letting crawlers follow their links.
  const apiVersion = isApi ? getApiDocsVersionFromSlug(normalizedSlug) : undefined;
  if (apiVersion && apiVersion !== latestApiDocsVersion) {
    return {
      ...metadata,
      robots: { index: false, follow: true },
    };
  }

  return metadata;
}

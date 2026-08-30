import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MainContentAds } from "@/features/docs/components/ads-section";
import { DocsArticleBody } from "@/features/docs/components/docs-article-body";
import { getApiDocsVersionLabel, isApiDocsVersion, latestApiDocsVersion } from "@/features/docs/lib/api-docs";
import { buildDocsBreadcrumbs } from "@/features/docs/lib/breadcrumbs";
import { getDocsMDXComponents } from "@/features/docs/lib/mdx-components";
import { getDocsSocialPreview } from "@/features/docs/lib/social-preview";
import { tocConfig } from "@/features/docs/lib/toc-config";
import { buildContentMetadata } from "@/shared/content/social-preview";
import { source } from "@/shared/content/source";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
// Every API reference URL is known from the OpenAPI sources at build time.
// Version-less and service-level URLs are normalized by next.config redirects
// before they reach this route.
export const dynamicParams = false;

interface RouteParams {
  version: string;
  slug?: string[];
}

function getPageSlug({ version, slug }: RouteParams): string[] {
  return ["api", version, ...(slug ?? [])];
}

export default async function Page(props: { params: Promise<RouteParams> }) {
  const params = await props.params;
  const page = source.getPage(getPageSlug(params));
  if (!page) notFound();

  const MDXContent = page.data.body;
  const apiVersionLabel = getApiDocsVersionLabel(params.version);

  // Don't pass an empty TOC - let fumadocs-openapi generate it. Also no
  // full-width layout, so the TOC column stays visible.
  const tocProps = !page.data.toc || page.data.toc.length === 0 ? {} : { toc: page.data.toc };

  const breadcrumbs = buildDocsBreadcrumbs(page.url, page.data.title, { apiVersionLabel });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "APIReference",
    name: page.data.title,
    description: page.data.description,
    url: `https://usememos.com${page.url}`,
    assemblyVersion: apiVersionLabel,
    executableLibraryName: "Memos API",
  };

  return (
    <DocsPage {...tocProps} {...tocConfig}>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={breadcrumbs.jsonLd} />
      <Breadcrumbs items={breadcrumbs.items} className="mb-6" />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsArticleBody>
        <MDXContent
          components={getDocsMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsArticleBody>
      <MainContentAds breakpoint="xl" />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source
    .generateParams()
    .filter((param) => param.slug?.[0] === "api" && isApiDocsVersion(param.slug[1]))
    .map((param) => ({ version: param.slug[1], slug: param.slug.slice(2) }));
}

export async function generateMetadata(props: { params: Promise<RouteParams> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(getPageSlug(params));
  if (!page) notFound();

  const preview = getDocsSocialPreview(page);
  const metadata = buildContentMetadata(preview, {
    title: page.data.title,
    type: "article",
  });

  // Keep only the "latest" API reference indexable. Older version snapshots are
  // near-duplicates that dilute crawl budget and split ranking authority, so we
  // noindex them while still letting crawlers follow their links.
  if (params.version !== latestApiDocsVersion) {
    return {
      ...metadata,
      robots: { index: false, follow: true },
    };
  }

  return metadata;
}

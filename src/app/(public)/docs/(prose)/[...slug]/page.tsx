import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdsSectionMobile } from "@/features/docs/components/ads-section";
import { DocsArticleBody } from "@/features/docs/components/docs-article-body";
import { MarkdownCopyButton, ViewOptionsPopover } from "@/features/docs/components/page-actions";
import { buildDocsBreadcrumbs } from "@/features/docs/lib/breadcrumbs";
import { getDocsMDXComponents } from "@/features/docs/lib/mdx-components";
import { getDocsSocialPreview } from "@/features/docs/lib/social-preview";
import { tocConfig } from "@/features/docs/lib/toc-config";
import { buildContentMetadata } from "@/shared/content/social-preview";
import { source } from "@/shared/content/source";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
// Every docs URL is known from the file sources at build time. Reject unknown
// slugs at the route boundary instead of loading the large MDX module to
// discover the page is missing at request time. API reference pages live under
// the api/[version] sibling route.
export const dynamicParams = false;

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  // Clean Markdown is served from /llms.mdx/* for prose docs.
  const markdownUrl = `/llms.mdx${page.url}`;

  const breadcrumbs = buildDocsBreadcrumbs(page.url, page.data.title);

  const jsonLd = {
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
    <DocsPage full={page.data.full} toc={page.data.toc} {...tocConfig}>
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={breadcrumbs.jsonLd} />
      <Breadcrumbs items={breadcrumbs.items} className="mb-6" />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <div className="mb-4 flex flex-row flex-wrap items-center gap-2">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} />
      </div>
      <DocsArticleBody>
        <MDXContent
          components={getDocsMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsArticleBody>
      <AdsSectionMobile breakpoint="xl" items={["sponsors", "carbon"]} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams().filter((param) => param.slug && param.slug.length > 0 && param.slug[0] !== "api");
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const preview = getDocsSocialPreview(page);
  const metadata = buildContentMetadata(preview, {
    title: page.data.title,
    type: "article",
  });

  // Advertise the clean Markdown version of prose docs for AI crawlers.
  metadata.alternates = {
    canonical: preview.url,
    types: {
      "text/markdown": `https://usememos.com/llms.mdx${page.url}`,
    },
  };

  return metadata;
}

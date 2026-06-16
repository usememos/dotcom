import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdsSectionMobile } from "@/features/docs/components/ads-section";
import { getDocsSocialPreview } from "@/features/docs/lib/social-preview";
import { tocConfig } from "@/features/docs/lib/toc-config";
import { getMDXComponents } from "@/mdx-components";
import { getOpenGraphImages, getTwitterImages } from "@/shared/content/social-preview";
import { source } from "@/shared/content/source";
import { buildBreadcrumbJsonLd } from "@/shared/lib/seo";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";

export const dynamic = "force-static";

export default async function Page() {
  const page = source.getPage([]);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const isApi = page.url.startsWith("/docs/api");
  const breadcrumbItems = [
    { href: "/", name: "Home" },
    { href: page.url, name: "Documentation" },
  ];

  const jsonLd = isApi
    ? {
        "@context": "https://schema.org",
        "@type": "APIReference",
        name: page.data.title,
        description: page.data.description,
        url: `https://usememos.com${page.url}`,
        assemblyVersion: "latest",
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
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} {...tocConfig}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
        <AdsSectionMobile />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = source.getPage([]);
  if (!page) notFound();

  const preview = getDocsSocialPreview(page);

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: preview.url,
      types: {
        "text/markdown": "https://usememos.com/llms.mdx/docs",
      },
    },
    openGraph: {
      title: preview.title,
      description: preview.description,
      type: "article",
      url: preview.url,
      images: getOpenGraphImages(preview),
    },
    twitter: {
      card: "summary_large_image",
      title: preview.title,
      description: preview.description,
      images: getTwitterImages(preview),
    },
  };
}

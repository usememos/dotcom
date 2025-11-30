import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdsSectionMobile } from "@/components/ads-section";
import { source } from "@/lib/source";
import { tocConfig } from "@/lib/toc-config";
import { getMDXComponents } from "@/mdx-components";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function Page() {
  const page = source.getPage([]);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const isApi = page.url.startsWith("/docs/api");

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

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} {...tocConfig}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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

  const isApi = page.url.startsWith("/docs/api");

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: `https://usememos.com${page.url}`,
    },
    openGraph: {
      title: isApi ? `${page.data.title} - Memos API Reference` : page.data.title,
      description: page.data.description,
      type: "article",
      url: `https://usememos.com${page.url}`,
    },
    twitter: {
      card: "summary_large_image",
      title: isApi ? `${page.data.title} - Memos API Reference` : page.data.title,
      description: page.data.description,
    },
  };
}

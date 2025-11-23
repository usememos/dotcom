import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsCarbonAdCardMobile } from "@/components/docs-carbon-ad-card-mobile";
import { source } from "@/lib/source";
import { tocConfig } from "@/lib/toc-config";
import { getMDXComponents } from "@/mdx-components";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
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
        <DocsCarbonAdCardMobile />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams().filter((param) => param.slug && param.slug.length > 0);
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const isApi = page.url.startsWith("/docs/api");
  const ogUrl = `/api/og/docs?slug=${params.slug.join("/")}`;

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
      images: [{ url: ogUrl, width: 1200, height: 630, alt: page.data.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: isApi ? `${page.data.title} - Memos API Reference` : page.data.title,
      description: page.data.description,
      images: [ogUrl],
    },
  };
}

import { source } from "@/lib/source";
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from "fumadocs-ui/page";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";
import { DocsSponsorCard } from "@/components/docs-sponsor-card";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";
import { DocsCarbonAdCardMobile } from "@/components/docs-carbon-ad-card-mobile";

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        footer: (
          <div className="flex flex-col gap-3 mt-2 mb-2">
            <DocsSponsorCard />
            <DocsCarbonAdCard />
          </div>
        ),
      }}
      tableOfContentPopover={{
        footer: (
          <div className="flex flex-col gap-3 mt-2 mb-2">
            <DocsSponsorCard />
          </div>
        ),
      }}
    >
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
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

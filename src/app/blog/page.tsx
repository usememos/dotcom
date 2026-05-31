import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CalendarIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import {
  EditorialEmptyState,
  EditorialIndexHeader,
  EditorialIndexShell,
  EditorialList,
  EditorialListItem,
} from "@/components/editorial-index";
import { Footer } from "@/components/footer";
import { formatBlogDate } from "@/lib/blog";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { getBlogIndexSocialPreview, getOpenGraphImages, getTwitterImages } from "@/lib/social-preview";
import { blogSource } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = 1800;

const socialPreview = getBlogIndexSocialPreview();

export const metadata: Metadata = {
  title: socialPreview.title,
  description: socialPreview.description,
  alternates: {
    canonical: socialPreview.url,
  },
  openGraph: {
    title: `${socialPreview.title} - Memos`,
    description: socialPreview.description,
    type: "website",
    url: socialPreview.url,
    siteName: "Memos",
    images: getOpenGraphImages(socialPreview),
  },
  twitter: {
    card: "summary_large_image",
    title: `${socialPreview.title} - Memos`,
    description: socialPreview.description,
    images: getTwitterImages(socialPreview),
  },
};

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/blog", name: "Blog" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function BlogPage() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.published_at).getTime();
    const dateB = new Date(b.data.published_at).getTime();
    return dateB - dateA;
  });

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <EditorialIndexShell>
          <EditorialIndexHeader
            breadcrumbs={breadcrumbItems}
            eyebrow="Blog"
            title="Notes from the project."
            description="Product thinking, self-hosting notes, and updates from the people building Memos."
          />

          {posts.length > 0 ? (
            <EditorialList>
              {posts.map((post) => (
                <EditorialListItem
                  key={post.url}
                  href={post.url}
                  title={post.data.title}
                  description={post.data.description}
                  labels={post.data.tags?.map((tag) => ({ label: tag }))}
                  meta={
                    <>
                      <CalendarIcon className="h-4 w-4 flex-shrink-0 text-zinc-700 dark:text-zinc-200" />
                      <span className="leading-6">{formatBlogDate(post.data.published_at)}</span>
                    </>
                  }
                  actionLabel="Read article"
                />
              ))}
            </EditorialList>
          ) : (
            <EditorialEmptyState
              icon={<UserIcon className="h-6 w-6 sm:h-8 sm:w-8" />}
              title="No blog posts yet"
              description="Check back soon for insights and updates from the Memos team."
            />
          )}
        </EditorialIndexShell>
      </main>
      <Footer />
    </HomeLayout>
  );
}

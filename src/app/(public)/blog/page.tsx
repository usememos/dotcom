import { HomeLayout } from "fumadocs-ui/layouts/home";
import { CalendarIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import {
  EditorialEmptyState,
  EditorialIndexHeader,
  EditorialIndexShell,
  EditorialList,
  EditorialListItem,
} from "@/features/editorial/components/editorial-index";
import { formatBlogDate } from "@/features/editorial/lib/blog";
import { getBlogIndexSocialPreview } from "@/features/editorial/lib/social-preview";
import { Footer } from "@/features/marketing/components/footer";
import { baseOptions } from "@/shared/config/layout";
import { buildContentMetadata } from "@/shared/content/social-preview";
import { blogSource } from "@/shared/content/source";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const revalidate = false;

const socialPreview = getBlogIndexSocialPreview();

export const metadata: Metadata = buildContentMetadata(socialPreview, {
  openGraphTitle: `${socialPreview.title} - Memos`,
});

const breadcrumbItems = buildBreadcrumbItems([{ href: "/blog", name: "Blog" }]);

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
        <JsonLdScript data={breadcrumbJsonLd} />
        <EditorialIndexShell>
          <EditorialIndexHeader
            eyebrow="Blog"
            title="Notes from the project."
            description="Product thinking, self-hosting notes, and updates from the team building Memos."
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

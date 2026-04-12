import { HomeLayout } from "fumadocs-ui/layouts/home";
import { UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { BlogListItem } from "@/components/blog-list-item";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { BLOG_COLUMN_CLASS } from "@/lib/blog";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";
import { blogSource } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = 1800;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Blog",
  description: "Insights, updates, and stories from the team building Memos, the open-source note-taking tool for instant capture.",
  path: "/blog",
});

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
        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className={BLOG_COLUMN_CLASS}>
            <div className="mb-12 border-b border-zinc-200 pb-10 dark:border-white/10 sm:mb-16">
              <Breadcrumbs items={breadcrumbItems} className="mb-10" />
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Blog</p>
              <h1 className="text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-6xl lg:text-7xl">
                Notes from the project.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Product thinking, self-hosting notes, and updates from the people building Memos.
              </p>
            </div>

            <div className="space-y-8 sm:space-y-10">
              {posts.map((post) => (
                <BlogListItem
                  key={post.url}
                  href={post.url}
                  title={post.data.title}
                  description={post.data.description}
                  publishedAt={post.data.published_at}
                  tags={post.data.tags}
                />
              ))}
            </div>

            {posts.length === 0 && (
              <div className="py-12 text-center sm:py-16">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/5 sm:mb-6 sm:h-16 sm:w-16">
                  <UserIcon className="h-6 w-6 text-zinc-400 sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-2 text-base font-medium text-zinc-900 dark:text-zinc-100 sm:text-lg">No blog posts yet</h3>
                <p className="px-4 text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
                  Check back soon for insights and updates from the Memos team.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}

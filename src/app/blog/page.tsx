import { HomeLayout } from "fumadocs-ui/layouts/home";
import { UserIcon } from "lucide-react";
import type { Metadata } from "next";
import { baseOptions } from "@/app/layout.config";
import { BlogListItem } from "@/components/blog-list-item";
import { Footer } from "@/components/footer";
import { BLOG_COLUMN_CLASS } from "@/lib/blog";
import { blogSource } from "@/lib/source";

export const dynamic = "force-static";
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Blogs",
  description: "Insights, updates, and stories from the team building Memos, the open-source note-taking tool for instant capture.",
  alternates: {
    canonical: "https://usememos.com/blog",
  },
  openGraph: {
    title: "Memos Blog - Insights & Updates",
    description: "Insights, updates, and stories from the team building Memos, the open-source note-taking tool for instant capture.",
    url: "https://usememos.com/blog",
    siteName: "Memos",
    images: [
      {
        url: "https://usememos.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Memos Blog",
      },
    ],
    type: "website",
  },
};

export default function BlogPage() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.published_at).getTime();
    const dateB = new Date(b.data.published_at).getTime();
    return dateB - dateA; // Sort by newest first
  });

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <section className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(245,247,244,0.98)_26%,rgba(245,247,244,1)_100%)] px-4 py-12 dark:bg-[linear-gradient(180deg,rgba(10,10,10,0.96)_0%,rgba(18,18,18,1)_28%,rgba(10,10,10,1)_100%)] sm:py-16 lg:py-24">
          <div className={BLOG_COLUMN_CLASS}>
            {/* Hero Section */}
            <div className="mb-12 sm:mb-16 lg:mb-20">
              <h1 className="mb-4 font-serif text-3xl font-bold leading-[1.02] tracking-tight text-gray-950 dark:text-gray-50 sm:mb-6 sm:text-4xl lg:text-5xl xl:text-[4.25rem]">
                Blogs
              </h1>
              <p className="max-w-2xl text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">
                Insights, updates, and stories from the team building Memos.
              </p>
            </div>

            {/* Blog Posts */}
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

            {/* Empty State */}
            {posts.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No blog posts yet</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 px-4">
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

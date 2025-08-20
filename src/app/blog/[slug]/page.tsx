import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, User, ArrowLeft, ExternalLink } from "lucide-react";
import { blogSource } from "@/lib/source";
import { DocsBody } from "fumadocs-ui/page";
import { TOCProvider, TOCScrollArea, TOCItems } from "fumadocs-ui/components/layout/toc";
import { notFound } from "next/navigation";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { getMDXComponents } from "@/mdx-components";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    notFound();
  }

  const { data } = page;
  const MDXContent = page.data.body;

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-6">{data.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{data.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(data.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {data.tags && data.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <div className="flex gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feature Image */}
            {data.feature_image && (
              <div className="mb-8">
                <img
                  src={data.feature_image}
                  alt={data.title}
                  className="w-full h-64 sm:h-80 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>
            )}

            {/* Description */}
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{data.description}</p>
          </header>
        </div>

        {/* Article Content with TOC */}
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <article className="max-w-none">
              <DocsBody>
                <MDXContent components={getMDXComponents()} />
              </DocsBody>
            </article>

            {/* Footer */}
            <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Written by <span className="font-medium text-gray-900 dark:text-gray-100">{data.author}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Published on{" "}
                    {new Date(data.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/blog"
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    More Posts
                  </Link>
                  <a
                    href="https://github.com/usememos/memos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <span>Try Memos</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </footer>
          </div>

          {/* Table of Contents Sidebar */}
          {page.data.toc && page.data.toc.length > 0 && (
            <div className="hidden xl:block w-64 flex-shrink-0">
              <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <TOCProvider toc={page.data.toc}>
                  <TOCScrollArea>
                    <TOCItems />
                  </TOCScrollArea>
                </TOCProvider>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    return {
      title: "Blog Post Not Found - Memos",
    };
  }

  const { data } = page;

  return {
    title: `${data.title} - Memos Blog`,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      publishedTime: data.published_at,
      authors: [data.author],
      images: data.feature_image ? [data.feature_image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: data.feature_image ? [data.feature_image] : undefined,
    },
  };
}

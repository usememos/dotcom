import type { Metadata } from "next";
import Link from "next/link";
import { CalendarIcon, UserIcon, ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
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
        <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="max-w-4xl mx-auto">
            {/* Back to Blog */}
            <Link
              href="/blog"
              className="group inline-flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 mb-12 transition-colors font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blog</span>
            </Link>

            {/* Article Header */}
            <header className="mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl mb-8 leading-tight">{data.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-8">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{data.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <span>
                    {new Date(data.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {data.tags && data.tags.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">•</span>
                    <div className="flex gap-2">
                      {data.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
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
                <div className="mb-10">
                  <img
                    src={data.feature_image}
                    alt={data.title}
                    className="w-full h-64 sm:h-80 object-cover rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
                  />
                </div>
              )}

              {/* Description */}
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">{data.description}</p>
            </header>
          </div>
        </section>

        {/* Article Content with TOC */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto flex gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <article className="max-w-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 shadow-sm">
                <DocsBody>
                  <MDXContent components={getMDXComponents()} />
                </DocsBody>
              </article>

              {/* Footer */}
              <footer className="mt-12">
                <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-700 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                    <div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                        Written by <span className="font-bold text-gray-900 dark:text-gray-100">{data.author}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
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
                        className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
                      >
                        More Posts
                      </Link>
                      <a
                        href="https://github.com/usememos/memos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
                      >
                        <span>Try Memos</span>
                        <ExternalLinkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            {/* Table of Contents Sidebar */}
            {page.data.toc && page.data.toc.length > 0 && (
              <div className="hidden xl:block w-64 flex-shrink-0">
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Table of Contents</h3>
                  <TOCProvider toc={page.data.toc}>
                    <TOCScrollArea>
                      <TOCItems />
                    </TOCScrollArea>
                  </TOCProvider>
                </div>
              </div>
            )}
          </div>
        </section>
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
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
import { DocsSponsorCard } from "@/components/docs-sponsor-card";
import { DocsCarbonAdCard } from "@/components/docs-carbon-ad-card";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const revalidate = 1800;

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
        <section className="pt-8 sm:pt-12 pb-4 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back to Blog */}
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 mb-8 sm:mb-12 transition-colors font-medium text-sm sm:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blog</span>
            </Link>

            {/* Feature Image */}
            {data.feature_image && (
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <img
                  src={data.feature_image}
                  alt={data.title}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg"
                />
              </div>
            )}

            {/* Article Header */}
            <header>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 leading-tight px-2 sm:px-0">
                {data.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-0 sm:gap-6 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">{data.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-sm sm:text-base">
                    {new Date(data.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {data.tags && data.tags.length > 0 && (
                  <div className="flex items-start gap-3 sm:items-center">
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 sm:px-3 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </header>
          </div>
        </section>

        {/* Article Content with TOC */}
        <section className="py-4 sm:py-6 lg:py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col xl:flex-row gap-8 xl:gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <article className="max-w-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-sm">
                <DocsBody>
                  <MDXContent components={getMDXComponents()} />
                </DocsBody>
              </article>

              {/* Mobile Ads - Show after content, before footer */}
              <div className="xl:hidden mt-8 space-y-4">
                <DocsSponsorCard />
                <DocsCarbonAdCard />
              </div>

              {/* Footer */}
              <footer className="mt-8 sm:mt-12">
                <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-700 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
                  <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:justify-between lg:items-center">
                    <div>
                      <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-2">
                        Written by <span className="font-bold text-gray-900 dark:text-gray-100">{data.author}</span>
                      </p>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Published on{" "}
                        {new Date(data.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Link
                        href="/blog"
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 font-semibold border border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm text-center text-sm sm:text-base"
                      >
                        More Posts
                      </Link>
                      <a
                        href="https://github.com/usememos/memos"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl sm:rounded-2xl hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg text-sm sm:text-base"
                      >
                        <span>Try Memos</span>
                        <ExternalLinkIcon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            {/* Table of Contents Sidebar - Desktop Only */}
            {page.data.toc && page.data.toc.length > 0 && (
              <div className="xl:block xl:w-64 xl:flex-shrink-0">
                {/* Desktop TOC - Fixed Sidebar */}
                <div className="hidden xl:block">
                  {/* Sticky container with all cards */}
                  <div className="sticky top-24 space-y-4">
                    {/* TOC Card - Scrollable */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm max-h-[calc(100vh-20rem)] overflow-y-auto">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Table of Contents</h3>
                      <TOCProvider toc={page.data.toc}>
                        <TOCScrollArea>
                          <TOCItems />
                        </TOCScrollArea>
                      </TOCProvider>
                    </div>
                    {/* Sponsor & Ads - Also sticky with TOC */}
                    <div className="flex flex-col gap-3">
                      <DocsSponsorCard />
                      <DocsCarbonAdCard />
                    </div>
                  </div>
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

import { HomeLayout } from "fumadocs-ui/layouts/home";
import { DocsBody } from "fumadocs-ui/page";
import { ArrowLeftIcon, CalendarIcon, ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { AdsSectionDesktop, AdsSectionMobile } from "@/components/ads-section";
import { Footer } from "@/components/footer";
import { TOCSidebar } from "@/components/toc-sidebar";
import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

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

  // JSON-LD structured data for blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    image: data.feature_image
      ? data.feature_image.startsWith("http")
        ? data.feature_image
        : `https://usememos.com${data.feature_image}`
      : "https://usememos.com/og-image.png",
    datePublished: data.published_at,
    author: {
      "@type": "Organization",
      name: "Memos Team",
      url: "https://usememos.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Memos",
      url: "https://usememos.com",
      logo: {
        "@type": "ImageObject",
        url: "https://usememos.com/logo-rounded.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://usememos.com/blog/${slug}`,
    },
  };

  return (
    <HomeLayout {...baseOptions}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            <header className="px-2 sm:px-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 leading-tight">
                {data.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                {/* Date */}
                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="text-sm sm:text-base">
                    {new Date(data.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                  <>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 sm:px-3 py-1 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </header>
          </div>
        </section>

        {/* Article Content with TOC */}
        <section className="py-4 sm:py-6 lg:py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <article className="max-w-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-sm">
                <DocsBody>
                  <MDXContent components={getMDXComponents()} />
                </DocsBody>
              </article>

              {/* Mobile Ads - Show after content, before footer */}
              <AdsSectionMobile />

              {/* Footer */}
              <footer className="mt-8 sm:mt-12">
                <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-700 border border-gray-100 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
                  <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:justify-between lg:items-center">
                    <div>
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
              <div className="lg:block lg:w-64 lg:flex-shrink-0">
                {/* Desktop TOC - Fixed Sidebar */}
                <div className="hidden lg:block">
                  {/* Sticky container with all cards */}
                  <div className="sticky top-24 space-y-4">
                    {/* TOC Card - Scrollable */}
                    <div className="p-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Table of Contents</h3>
                      <TOCSidebar toc={page.data.toc} />
                    </div>
                    {/* Sponsor & Ads - Also sticky with TOC */}
                    <AdsSectionDesktop />
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
  const pageUrl = `https://usememos.com/blog/${slug}`;

  // Ensure image URLs are absolute
  const getAbsoluteImageUrl = (url: string | undefined) => {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `https://usememos.com${url.startsWith("/") ? url : `/${url}`}`;
  };

  const absoluteImageUrl = getAbsoluteImageUrl(data.feature_image);

  return {
    title: `${data.title} - Memos Blog`,
    description: data.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      publishedTime: data.published_at,
      url: pageUrl,
      images: absoluteImageUrl ? [absoluteImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: absoluteImageUrl ? [absoluteImageUrl] : undefined,
    },
  };
}

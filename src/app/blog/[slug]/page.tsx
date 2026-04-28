import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { AdsSectionDesktop, AdsSectionMobile } from "@/components/ads-section";
import { BlogArticleBody } from "@/components/blog-article-body";
import { BlogPostFooter } from "@/components/blog-post-footer";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogPostHeroImage } from "@/components/blog-post-hero-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { TOCSidebar } from "@/components/toc-sidebar";
import { BLOG_ARTICLE_COLUMN_CLASS, BLOG_DETAIL_LAYOUT_CLASS, formatBlogDate } from "@/lib/blog";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { getBlogSocialPreview, getOpenGraphImages, getTwitterImages } from "@/lib/social-preview";
import { blogSource } from "@/lib/source";

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
  const Content = page.data.body;
  const breadcrumbItems = [
    { href: "/", name: "Home" },
    { href: "/blog", name: "Blog" },
    { href: `/blog/${slug}`, name: data.title },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);
  const preview = getBlogSocialPreview(page);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    image: preview.imageUrl,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <section className="px-4 pb-8 pt-8 sm:pt-12 lg:pb-10">
          <div className={BLOG_DETAIL_LAYOUT_CLASS}>
            <div className="min-w-0">
              <div className={BLOG_ARTICLE_COLUMN_CLASS}>
                <Breadcrumbs items={breadcrumbItems} className="mb-6" />
                <Link
                  href="/blog"
                  className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-700 sm:mb-12"
                >
                  <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Blog</span>
                </Link>
              </div>
              <BlogPostHeader title={data.title} description={data.description} publishedAt={data.published_at} tags={data.tags} />
              {data.feature_image && <BlogPostHeroImage src={data.feature_image} alt={data.title} />}
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 pt-2 sm:pb-20">
          <div className={BLOG_DETAIL_LAYOUT_CLASS}>
            <div className="min-w-0">
              <BlogArticleBody content={Content} />
              <AdsSectionMobile />
              <BlogPostFooter />
            </div>
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {page.data.toc && page.data.toc.length > 0 && (
                  <div className="rounded-lg bg-zinc-50 p-4 dark:bg-white/5">
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                      On This Article
                    </h2>
                    <div className="mt-4">
                      <TOCSidebar toc={page.data.toc} />
                    </div>
                  </div>
                )}
                <div className="rounded-lg bg-zinc-50 p-4 dark:bg-white/5">
                  <div className="space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{data.title}</p>
                    <p>Published on {formatBlogDate(data.published_at)}</p>
                    {data.tags && data.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {data.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <AdsSectionDesktop />
              </div>
            </aside>
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
  const preview = getBlogSocialPreview(page);

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: preview.url,
    },
    openGraph: {
      title: preview.title,
      description: preview.description,
      type: "article",
      publishedTime: data.published_at,
      url: preview.url,
      images: getOpenGraphImages(preview),
    },
    twitter: {
      card: "summary_large_image",
      title: preview.title,
      description: preview.description,
      images: getTwitterImages(preview),
    },
  };
}

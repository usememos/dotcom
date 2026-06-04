import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdsSectionDesktop, AdsSectionMobile } from "@/features/docs/components/ads-section";
import { TOCSidebar } from "@/features/docs/components/toc-sidebar";
import { BlogArticleBody } from "@/features/editorial/components/blog-article-body";
import { BlogPostFooter } from "@/features/editorial/components/blog-post-footer";
import { BlogPostHeader } from "@/features/editorial/components/blog-post-header";
import { BlogPostHeroImage } from "@/features/editorial/components/blog-post-hero-image";
import { BLOG_ARTICLE_COLUMN_CLASS, BLOG_DETAIL_LAYOUT_CLASS, formatBlogDate } from "@/features/editorial/lib/blog";
import { getBlogSocialPreview } from "@/features/editorial/lib/social-preview";
import { Footer } from "@/features/marketing/components/footer";
import { baseOptions } from "@/shared/config/layout";
import { buildContentMetadata } from "@/shared/content/social-preview";
import { blogSource } from "@/shared/content/source";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);

  if (!page) {
    notFound();
  }

  const { data } = page;
  const Content = page.data.body;
  const breadcrumbItems = buildBreadcrumbItems([
    { href: "/blog", name: "Blog" },
    { href: `/blog/${slug}`, name: data.title },
  ]);
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
      <JsonLdScript data={jsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <section className="px-4 pb-8 pt-8 sm:pt-12 lg:pb-10">
          <div className={BLOG_DETAIL_LAYOUT_CLASS}>
            <div className="min-w-0">
              <div className={BLOG_ARTICLE_COLUMN_CLASS}>
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
      title: "Blog Post Not Found",
    };
  }

  const { data } = page;
  const preview = getBlogSocialPreview(page);

  return buildContentMetadata(preview, {
    title: data.title,
    type: "article",
    publishedTime: data.published_at,
  });
}

import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { BlogArticleBody } from "@/components/blog-article-body";
import { BlogPostFooter } from "@/components/blog-post-footer";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogPostHeroImage } from "@/components/blog-post-hero-image";
import { Footer } from "@/components/footer";
import { getAbsoluteBlogImageUrl } from "@/lib/blog";
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

  // JSON-LD structured data for blog post
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    image: getAbsoluteBlogImageUrl(data.feature_image) ?? "https://usememos.com/og-image.png",
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
      <main className="flex flex-1 flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(245,247,244,0.98)_26%,rgba(245,247,244,1)_100%)] dark:bg-[linear-gradient(180deg,rgba(10,10,10,0.96)_0%,rgba(18,18,18,1)_28%,rgba(10,10,10,1)_100%)]">
        <section className="px-4 pb-8 pt-8 sm:pt-12 lg:pb-10">
          <div className="mx-auto max-w-6xl">
            <BlogPostHeader title={data.title} description={data.description} publishedAt={data.published_at} tags={data.tags} />

            {/* Feature Image */}
            {data.feature_image && <BlogPostHeroImage src={data.feature_image} alt={data.title} />}
          </div>
        </section>

        {/* Article Content */}
        <section className="px-4 pb-16 pt-2 sm:pb-20">
          <div className="mx-auto max-w-6xl">
            <BlogArticleBody content={Content} />
            <BlogPostFooter />
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
  const absoluteImageUrl = getAbsoluteBlogImageUrl(data.feature_image);

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

import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { BlogArticleBody } from "@/components/blog-article-body";
import { BlogPostFooter } from "@/components/blog-post-footer";
import { BlogPostHeader } from "@/components/blog-post-header";
import { BlogPostHeroImage } from "@/components/blog-post-hero-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { getAbsoluteBlogImageUrl } from "@/lib/blog";
import { buildBreadcrumbJsonLd, DEFAULT_OG_IMAGE } from "@/lib/seo";
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    image: getAbsoluteBlogImageUrl(data.feature_image) ?? DEFAULT_OG_IMAGE,
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
          <div className="mx-auto max-w-6xl">
            <div className="mb-8">
              <Breadcrumbs items={breadcrumbItems} className={undefined} />
            </div>
            <BlogPostHeader title={data.title} description={data.description} publishedAt={data.published_at} tags={data.tags} />
            {data.feature_image && <BlogPostHeroImage src={data.feature_image} alt={data.title} />}
          </div>
        </section>

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
  const imageUrl = absoluteImageUrl ?? DEFAULT_OG_IMAGE;

  return {
    title: data.title,
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
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [imageUrl],
    },
  };
}

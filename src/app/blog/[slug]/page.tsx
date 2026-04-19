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

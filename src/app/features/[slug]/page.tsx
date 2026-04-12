import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { getAllFeatureSlugs, getFeature } from "@/lib/features";
import { buildBreadcrumbJsonLd, buildDefaultOpenGraphImages, DEFAULT_OG_IMAGE } from "@/lib/seo";

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const revalidate = 86400;

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    notFound();
  }

  const breadcrumbItems = [
    { href: "/", name: "Home" },
    { href: "/features", name: "Features" },
    { href: `/features/${slug}`, name: feature.title },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto w-full max-w-(--fd-layout-width)">
            <Breadcrumbs items={breadcrumbItems} className="mb-10" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:items-end lg:gap-16">
              <div>
                <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Feature</p>
                <h1 className="text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                  {feature.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">{feature.hero.subtitle}</p>
              </div>
              <p className="rounded-lg bg-zinc-50 p-4 text-sm leading-7 text-zinc-600 dark:bg-white/5 dark:text-zinc-300">
                {feature.description}
              </p>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Install Memos
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://demo.usememos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Benefits</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Why it matters.
              </h2>
            </div>
            <div className="grid gap-2">
              {feature.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 rounded-lg bg-zinc-50 px-4 py-3 text-sm leading-7 text-zinc-700 dark:bg-white/5 dark:text-zinc-300 sm:text-base"
                >
                  <CheckCircleIcon className="mt-1 h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Use Cases</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                Works well for.
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {feature.useCases.map((useCase) => (
                <div key={useCase.title} className="rounded-lg bg-zinc-50 p-4 dark:bg-white/5">
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{useCase.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{useCase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto grid w-full max-w-(--fd-layout-width) gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Technical Details</p>
              <h2 className="mt-4 text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                What it uses.
              </h2>
            </div>
            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {feature.techDetails.map((detail) => (
                <div
                  key={detail}
                  className="flex items-start gap-3 rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:bg-white/5 dark:text-zinc-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Ready to start?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Put {feature.title.toLowerCase()} to work in a self-hosted Memos instance you control.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              >
                Install Memos
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}

export async function generateStaticParams() {
  return getAllFeatureSlugs().map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);

  if (!feature) {
    return {
      title: "Feature Not Found - Memos",
    };
  }

  const pageUrl = `https://usememos.com/features/${slug}`;

  return {
    title: `${feature.title} Feature`,
    description: feature.description,
    keywords: [`memos ${feature.title.toLowerCase()}`, "self-hosted", "privacy", "note taking", "open source"],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${feature.title} - Memos`,
      description: feature.description,
      url: pageUrl,
      siteName: "Memos",
      images: buildDefaultOpenGraphImages(`Memos ${feature.title}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${feature.title} - Memos`,
      description: feature.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

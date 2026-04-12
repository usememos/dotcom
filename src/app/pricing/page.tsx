import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ArrowRightIcon, GithubIcon, HeartIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Pricing",
  description: "Memos software is free because you run it yourself. No subscriptions, no paid unlocks, and no vendor lock-in.",
  path: "/pricing",
});

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/pricing", name: "Pricing" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const INCLUDED = [
  {
    title: "No paid unlocks",
    description: "Quick capture, timeline browsing, tags, sharing, and API access are available from the first deploy.",
  },
  {
    title: "No seat pricing",
    description: "Memos does not meter users, notes, or timelines behind pricing plans.",
  },
  {
    title: "MIT licensed",
    description: "The codebase stays open for review, forks, custom deployments, and long-term ownership.",
  },
] as const;

const WHY_FREE = [
  "Memos ships as open-source software, not a hosted subscription service.",
  "You run the app on your own infrastructure, so there is no hosted seat pricing to pass through.",
  "The product stays focused on quick capture instead of enterprise plan packaging.",
] as const;

export default function PricingPage() {
  return (
    <HomeLayout {...baseOptions}>
      <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={breadcrumbItems} className="mb-10" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Pricing</p>
              <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.04] tracking-normal text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
                Free to use. Yours to run.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Memos has no subscriptions, seat pricing, or paid unlocks. You run the product and choose the infrastructure.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/docs/getting-started"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                >
                  Install Memos
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <a
                  href="https://github.com/usememos/memos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 dark:border-white/10 sm:px-6">
          <div className="mx-auto grid max-w-6xl divide-y divide-zinc-200 dark:divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {INCLUDED.map((item) => (
              <div key={item.title} className="py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <h2 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{item.title}</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-zinc-200 px-4 py-14 dark:border-white/10 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase dark:text-zinc-400">Why Free</p>
              <h2 className="mt-4 max-w-2xl text-balance font-serif text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-4xl">
                The model follows the product.
              </h2>
            </div>
            <div className="border-y border-zinc-200 dark:border-white/10">
              {WHY_FREE.map((item, index) => (
                <div
                  key={item}
                  className="grid gap-4 border-b border-zinc-200 py-5 last:border-b-0 dark:border-white/10 sm:grid-cols-[4rem_minmax(0,1fr)]"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-zinc-400">{String(index + 1).padStart(2, "0")}</p>
                  <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-balance font-serif text-4xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Help keep Memos moving.
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Star the project, contribute improvements, or sponsor ongoing development.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://github.com/usememos/memos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                <GithubIcon className="h-4 w-4" />
                View on GitHub
              </a>
              <a
                href="https://github.com/sponsors/usememos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-white/8"
              >
                <HeartIcon className="h-4 w-4" />
                Sponsor
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </HomeLayout>
  );
}

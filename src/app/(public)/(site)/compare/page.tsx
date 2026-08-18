import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { MarketingActions } from "@/features/marketing/components/marketing-page";
import { COMPARISON_SLUGS, COMPARISONS } from "@/features/marketing/data/comparisons";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Compare",
  description:
    "Compare Memos with Obsidian, Joplin, Notion, Google Keep, and Evernote — an open-source, self-hosted note-taking app. See how it stacks up and when to choose each.",
  path: "/compare",
});

const breadcrumbItems = buildBreadcrumbItems([{ href: "/compare", name: "Compare" }]);
const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const MEMOS_BASELINE = [
  { label: "License", value: "MIT open source" },
  { label: "Hosting", value: "Your server" },
  { label: "Software price", value: "$0" },
] as const;

export default function ComparePage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <section className="py-14 lg:py-20">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.48fr)] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Compare</p>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
              How Memos <HeroAccent>compares.</HeroAccent>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Start with the job, not the feature count. These comparisons explain where Memos is the clearer fit and where another tool is
              stronger.
            </p>
            <div className="mt-9">
              <MarketingActions
                align="left"
                actions={[
                  { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
                  { label: "Try Live Demo", href: "https://demo.usememos.com/" },
                ]}
              />
            </div>
          </div>

          <aside aria-label="Memos comparison baseline" className="border-y border-zinc-300 dark:border-white/15">
            <p className="py-4 text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Memos baseline</p>
            <dl>
              {MEMOS_BASELINE.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between gap-6 border-t border-zinc-200 py-4 dark:border-white/10"
                >
                  <dt className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</dt>
                  <dd className="text-right font-serif text-lg font-semibold text-zinc-950 dark:text-zinc-100">{item.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
        <div className="site-container">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brand-700 uppercase dark:text-brand-300">Choose a reference point</p>
              <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]">
                Compare the shape of the work.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-300 lg:justify-self-end">
              Each guide covers hosting, ownership, format, cost, and the situations where either product makes more sense.
            </p>
          </div>

          <div className="mt-14 border-y border-zinc-300 dark:border-white/15 lg:mt-16">
            {COMPARISON_SLUGS.map((slug) => {
              const comparison = COMPARISONS[slug];
              const Icon = comparison.icon;

              return (
                <Link
                  key={slug}
                  href={`/compare/${slug}`}
                  prefetch={false}
                  className="group grid gap-4 border-b border-zinc-200 py-6 last:border-b-0 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:grid-cols-[2rem_minmax(12rem,0.62fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-6 dark:border-white/10 dark:focus-visible:outline-brand-300"
                >
                  <Icon className="size-5 stroke-[1.7] text-zinc-400 transition-colors group-hover:text-brand-700 dark:text-zinc-500 dark:group-hover:text-brand-300" />
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{comparison.title}</h3>
                  <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">{comparison.subtitle}</p>
                  <span className="hidden items-center gap-2 text-sm font-semibold text-zinc-500 group-hover:text-brand-700 sm:flex dark:text-zinc-400 dark:group-hover:text-brand-300">
                    Compare
                    <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

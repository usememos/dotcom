import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { MarketingActions } from "@/features/marketing/components/marketing-page";
import { FEATURES, type FeatureSlug } from "@/features/marketing/data/features";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  ...buildMarketingMetadata({
    title: "Features",
    description:
      "Everything Memos does and nothing it doesn't — quick capture, Markdown notes, tags, universal search, a private timeline, and self-hosted ownership. Free and open source.",
    path: "/features",
  }),
  description:
    "Everything Memos does and nothing it doesn't — quick capture, Markdown notes, tags, universal search, a private timeline, and self-hosted ownership. Free and open source.",
  keywords: [
    "note taking features",
    "self-hosted",
    "privacy",
    "markdown",
    "quick capture",
    "tags",
    "search",
    "export",
    "keyboard shortcuts",
  ],
};

const breadcrumbItems = buildBreadcrumbItems([{ href: "/features", name: "Features" }]);
const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

interface FeatureGroupDefinition {
  id: string;
  title: string;
  description: string;
  slugs: readonly FeatureSlug[];
}

interface FeatureChapterDefinition {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  surface: "plain" | "quiet";
  groups: readonly FeatureGroupDefinition[];
}

const FEATURE_CHAPTERS = [
  {
    id: "use-memos",
    eyebrow: "Use Memos",
    title: "Write first. Organize when the note asks for it.",
    description:
      "Capture stays fast. Markdown, media, search, tags, and publishing appear around the memo instead of becoming setup you must finish first.",
    surface: "plain",
    groups: [
      {
        id: "capture",
        title: "Capture",
        description: "The shortest path from thought to saved memo.",
        slugs: ["instant-save", "quick-capture", "markdown-support", "media-integration", "keyboard-shortcuts"],
      },
      {
        id: "review",
        title: "Review",
        description: "Find, filter, and revisit notes without planning a large system first.",
        slugs: ["universal-search", "tags", "timeline-view", "import", "export"],
      },
      {
        id: "publishing",
        title: "Publishing",
        description: "Share selected notes while keeping private memos private.",
        slugs: ["public-sharing", "microblog", "community", "multi-language"],
      },
    ],
  },
  {
    id: "run-memos",
    eyebrow: "Run Memos",
    title: "Keep the software as legible as the notes.",
    description:
      "Choose the server, database, deployment shape, and integrations. Memos stays open source, portable, and free to run on your terms.",
    surface: "quiet",
    groups: [
      {
        id: "ownership",
        title: "Ownership",
        description: "Run the product yourself and keep the data path legible.",
        slugs: ["self-hosted", "data-ownership", "open-source", "no-fees", "no-dependencies", "database-support"],
      },
      {
        id: "operations",
        title: "Operations",
        description: "Keep Memos fast, portable, and easy to fit into your stack.",
        slugs: ["beautiful-design", "pwa-support", "customizable-ui", "cross-platform", "performance", "lightweight", "api-first"],
      },
    ],
  },
] as const satisfies readonly FeatureChapterDefinition[];

const FEATURE_GROUPS: readonly FeatureGroupDefinition[] = FEATURE_CHAPTERS.flatMap<FeatureGroupDefinition>((chapter) => chapter.groups);

function FeatureIndex() {
  return (
    <nav aria-label="Feature groups" className="border-y border-zinc-300 py-5 dark:border-white/15 sm:py-6">
      <div className="flex items-center justify-between gap-6">
        <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Browse by purpose</p>
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">27 features</p>
      </div>
      <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-1">
        {FEATURE_GROUPS.map((group) => (
          <Link
            key={group.id}
            href={`#${group.id}`}
            className="group flex items-center justify-between gap-6 text-zinc-950 transition-colors hover:text-teal-700 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:text-zinc-100 dark:hover:text-teal-300 dark:focus-visible:outline-teal-300"
          >
            <span className="text-base font-semibold tracking-tight">{group.title}</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500">{String(group.slugs.length).padStart(2, "0")}</span>
              <ArrowRightIcon className="size-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-700 dark:text-zinc-500 dark:group-hover:text-teal-300" />
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function FeatureGroup({ group }: { group: FeatureGroupDefinition }) {
  return (
    <section id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-24">
      <div className="grid gap-9 lg:grid-cols-[minmax(12rem,0.52fr)_minmax(0,1.48fr)] lg:gap-16">
        <div>
          <h3
            id={`${group.id}-title`}
            className="font-serif text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-4xl"
          >
            {group.title}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{group.description}</p>
        </div>

        <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {group.slugs.map((slug) => {
            const feature = FEATURES[slug];
            const Icon = feature.icon;
            const isWip = "wip" in feature && feature.wip;

            return (
              <li key={slug}>
                <Link
                  href={`/features/${slug}`}
                  prefetch={false}
                  className="group/link block focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 dark:focus-visible:outline-teal-300"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="mt-1 size-5 shrink-0 stroke-[1.7] text-zinc-400 transition-colors group-hover/link:text-teal-700 dark:text-zinc-500 dark:group-hover/link:text-teal-300" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-semibold tracking-tight text-zinc-950 transition-colors group-hover/link:text-teal-700 dark:text-zinc-100 dark:group-hover/link:text-teal-300">
                          {feature.title}
                        </h4>
                        {isWip ? (
                          <span className="mt-0.5 shrink-0 rounded-md border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-white/15 dark:text-zinc-400">
                            WIP
                          </span>
                        ) : (
                          <ArrowRightIcon className="mt-1 size-4 shrink-0 text-zinc-400 transition-transform group-hover/link:translate-x-1 dark:text-zinc-500" />
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{feature.description}</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <section className="py-14 lg:py-20">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.48fr)] lg:items-end lg:gap-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Features</p>
            <h1 className="mt-5 text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
              Everything begins with <HeroAccent>a memo.</HeroAccent>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Capture in Markdown, find it by tag or search, share only what you choose, and keep the entire stack on infrastructure you
              control.
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
          <FeatureIndex />
        </div>
      </section>

      {FEATURE_CHAPTERS.map((chapter) => (
        <section
          key={chapter.id}
          aria-labelledby={`${chapter.id}-title`}
          className={chapter.surface === "quiet" ? "bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24" : "py-16 sm:py-20 lg:py-24"}
        >
          <div className="site-container">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">{chapter.eyebrow}</p>
                <h2
                  id={`${chapter.id}-title`}
                  className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl lg:text-[3.35rem]"
                >
                  {chapter.title}
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[1.0625rem] sm:leading-8 lg:justify-self-end">
                {chapter.description}
              </p>
            </div>

            <div className="mt-16 space-y-16 sm:mt-20 sm:space-y-20 lg:space-y-24">
              {chapter.groups.map((group) => (
                <FeatureGroup key={group.id} group={group} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Start here</p>
            <h2 className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl">
              Start with one memo.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300">
              Install Memos on your server or try the live demo before you decide.
            </p>
          </div>
          <MarketingActions
            align="left"
            actions={[
              { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
              { label: "Try Live Demo", href: "https://demo.usememos.com/" },
            ]}
          />
        </div>
      </section>
    </main>
  );
}

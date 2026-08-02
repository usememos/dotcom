import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { MarketingCtaSection } from "@/features/marketing/components/marketing-page";
import { getAllUseCaseSlugs, getUseCase } from "@/features/marketing/data/use-cases";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = {
  ...buildMarketingMetadata({
    title: "Use Cases",
    description: "See where Memos fits best: quick notes, daily logs, links, snippets, private updates, and lightweight documentation.",
    path: "/use-cases",
  }),
  title: "Use Cases",
  description: "See where Memos fits best: quick notes, daily logs, links, snippets, private updates, and lightweight documentation.",
  keywords: [
    "note taking use cases",
    "self-hosted notes",
    "developer notes",
    "team documentation",
    "quick capture notes",
    "privacy-focused notes",
    "research notes",
    "business documentation",
    "code snippets manager",
    "markdown notes",
  ],
};

const breadcrumbItems = [
  { href: "/", name: "Home" },
  { href: "/use-cases", name: "Use Cases" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const USE_CASE_GROUPS = [
  {
    id: "personal",
    eyebrow: "For yourself",
    title: "Think, learn, and make.",
    description: "Keep the fragments that matter to your own work and memory.",
    slugs: ["personal-knowledge", "writers", "students-researchers", "hobbyists-makers"],
  },
  {
    id: "shared",
    eyebrow: "With people",
    title: "Keep a small shared record.",
    description: "Share updates and working context without building a full workspace.",
    slugs: ["family", "teams"],
  },
  {
    id: "operational",
    eyebrow: "Close to the work",
    title: "Document systems and sensitive work.",
    description: "Put technical and private notes next to infrastructure you control.",
    slugs: ["developers", "self-hosting", "privacy-professionals"],
  },
] as const;

export default function UseCasesPage() {
  const slugs = getAllUseCaseSlugs();
  const groupedSlugs = USE_CASE_GROUPS.flatMap((group) => group.slugs);
  const publicSlugs = new Set<string>(slugs);

  if (new Set(groupedSlugs).size !== slugs.length || groupedSlugs.some((slug) => !publicSlugs.has(slug))) {
    throw new Error("Use case groups must include every public use case exactly once.");
  }

  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section className="py-14 lg:py-20">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.48fr)] lg:items-end lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">Use cases</p>
            <h1 className="mt-5 max-w-4xl text-balance font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-50 sm:text-6xl lg:text-7xl">
              Use Memos where quick notes <HeroAccent>actually happen.</HeroAccent>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Start from the context you already have: a thought, a shared update, a server change, or work that should stay private.
            </p>
          </div>

          <nav aria-label="Use case groups" className="border-y border-zinc-300 py-2 dark:border-white/15">
            {USE_CASE_GROUPS.map((group) => (
              <a
                key={group.id}
                href={`#${group.id}`}
                className="group flex items-center justify-between gap-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:text-teal-700 dark:text-zinc-200 dark:hover:text-teal-300"
              >
                <span>{group.eyebrow}</span>
                <span className="flex items-center gap-3 font-mono text-xs font-normal text-zinc-400 dark:text-zinc-500">
                  {String(group.slugs.length).padStart(2, "0")}
                  <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {USE_CASE_GROUPS.map((group, groupIndex) => (
        <section
          key={group.id}
          id={group.id}
          aria-labelledby={`${group.id}-title`}
          className={
            groupIndex === 1
              ? "scroll-mt-20 bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24"
              : "scroll-mt-20 py-16 sm:py-20 lg:py-24"
          }
        >
          <div className="site-container grid gap-10 lg:grid-cols-[minmax(20rem,0.72fr)_minmax(0,1.28fr)] lg:gap-20">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-semibold tracking-[0.18em] text-teal-700 uppercase dark:text-teal-300">{group.eyebrow}</p>
              <h2
                id={`${group.id}-title`}
                className="mt-4 text-balance font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] text-zinc-950 dark:text-zinc-100 sm:text-5xl"
              >
                {group.title}
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-zinc-600 dark:text-zinc-300">{group.description}</p>
            </div>

            <ul className="border-y border-zinc-300 dark:border-white/15">
              {group.slugs.map((slug) => {
                const useCase = getUseCase(slug);

                if (!useCase) {
                  return null;
                }

                const Icon = useCase.icon;

                return (
                  <li key={slug} className="border-b border-zinc-200 last:border-b-0 dark:border-white/10">
                    <Link
                      href={`/use-cases/${slug}`}
                      prefetch={false}
                      className="group grid gap-4 py-6 focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 sm:grid-cols-[2rem_minmax(11rem,0.7fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-6 dark:focus-visible:outline-teal-300"
                    >
                      <Icon className="size-5 stroke-[1.7] text-zinc-400 transition-colors group-hover:text-teal-700 dark:text-zinc-500 dark:group-hover:text-teal-300" />
                      <h3 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">{useCase.title}</h3>
                      <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">{useCase.subtitle}</p>
                      <ArrowRightIcon className="hidden size-4 text-zinc-400 transition-transform group-hover:translate-x-1 sm:block dark:text-zinc-500" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ))}

      <MarketingCtaSection
        title="Ready to start with one note?"
        description="Start with the workflow Memos does best: quick capture, private timelines, and lightweight review."
        actions={[
          { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
          { label: "See Features", href: "/features" },
        ]}
      />
    </main>
  );
}

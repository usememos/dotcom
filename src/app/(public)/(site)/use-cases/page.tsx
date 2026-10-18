import type { Metadata } from "next";
import { AnchorPills } from "@/features/marketing/components/anchor-pills";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { LinkGrid } from "@/features/marketing/components/link-grid";
import { PageHero } from "@/features/marketing/components/page-hero";
import { StartSection } from "@/features/marketing/components/start-section";
import { getAllUseCaseSlugs, getUseCase } from "@/features/marketing/data/use-cases";
import { buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const metadata: Metadata = {
  ...buildMarketingMetadata({
    title: "Use Cases",
    description: "Keep quick thoughts, daily logs, links, snippets, and updates for family and friends.",
    path: "/use-cases",
  }),
  title: "Use Cases",
  description: "Keep quick thoughts, daily logs, links, snippets, and updates for family and friends.",
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
    description: "Each person keeps their own memos and chooses what to share.",
    slugs: ["family", "teams"],
  },
  {
    id: "operational",
    eyebrow: "Close to the work",
    title: "Keep notes beside your work.",
    description: "Keep snippets, observations, and reminders you can return to later.",
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
      <JsonLdScript data={breadcrumbJsonLd} />

      <PageHero
        eyebrow="Use cases"
        title={
          <>
            Use Memos where quick notes <HeroAccent>actually happen.</HeroAccent>
          </>
        }
        lead="Start from the context you already have: a thought, a shared update, a server change, or work that should stay private."
      >
        <AnchorPills
          label="Use case groups"
          items={USE_CASE_GROUPS.map((group) => ({ href: `#${group.id}`, label: group.eyebrow, count: group.slugs.length }))}
        />
      </PageHero>

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
          <div className="site-container">
            <ChapterHeader id={`${group.id}-title`} eyebrow={group.eyebrow} title={group.title} description={group.description} />
            <div className="mt-12 sm:mt-14">
              <LinkGrid
                items={group.slugs.flatMap((slug) => {
                  const useCase = getUseCase(slug);
                  if (!useCase) return [];
                  const Icon = useCase.icon;
                  return [
                    {
                      href: `/use-cases/${slug}`,
                      title: useCase.title,
                      description: useCase.subtitle,
                      icon: <Icon aria-hidden="true" className="size-5 stroke-[1.7]" />,
                    },
                  ];
                })}
              />
            </div>
          </div>
        </section>
      ))}

      <StartSection
        description="Write short memos as they come, and find them later by search, tag, or date."
        actions={[
          { label: "Installation", href: "/docs/getting-started", showArrow: true },
          { label: "See Features", href: "/features" },
        ]}
      />
    </main>
  );
}

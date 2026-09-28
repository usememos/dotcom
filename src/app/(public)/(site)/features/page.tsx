import type { Metadata } from "next";
import { AnchorPills } from "@/features/marketing/components/anchor-pills";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { HeroAccent } from "@/features/marketing/components/hero-accent";
import { LinkGrid } from "@/features/marketing/components/link-grid";
import { MemoAnatomyShowcase } from "@/features/marketing/components/memo-anatomy-showcase";
import { PageHero } from "@/features/marketing/components/page-hero";
import { StartSection } from "@/features/marketing/components/start-section";
import { FEATURES, type FeatureSlug } from "@/features/marketing/data/features";
import { buildBreadcrumbItems, buildBreadcrumbJsonLd, buildMarketingMetadata } from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  ...buildMarketingMetadata({
    title: "Features",
    description:
      "Every Memos feature: quick capture in Markdown, then search, tags, views, and a private timeline to find memos again. Self-hosted and open source, with export.",
    path: "/features",
  }),
  description:
    "Every Memos feature: quick capture in Markdown, then search, tags, views, and a private timeline to find memos again. Self-hosted and open source, with export.",
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
      "There is no title or folder to choose first. Markdown, attachments, tags, search, and sharing sit around the memo, ready when you need them.",
    surface: "plain",
    groups: [
      {
        id: "capture",
        title: "Write",
        description: "The shortest path from thought to saved memo.",
        slugs: ["instant-save", "quick-capture", "markdown-support", "media-integration", "keyboard-shortcuts"],
      },
      {
        id: "review",
        title: "Find",
        description: "Search, filter by tag or view, and look back through the timeline without planning a system first.",
        slugs: ["universal-search", "tags", "timeline-view"],
      },
      {
        id: "publishing",
        title: "Publishing",
        description: "Share the memos you choose. New memos start private.",
        slugs: ["public-sharing", "microblog", "community", "multi-language"],
      },
    ],
  },
  {
    id: "run-memos",
    eyebrow: "Run Memos",
    title: "Keep the software as legible as the notes.",
    description:
      "Choose the server, database, and integrations. Memos is open source under the MIT license with no license fee, and your memos export to a portable ZIP.",
    surface: "quiet",
    groups: [
      {
        id: "ownership",
        title: "Ownership",
        description: "Run Memos yourself, keep the data path legible, and take your memos with you.",
        slugs: ["self-hosted", "data-ownership", "open-source", "no-fees", "no-dependencies", "database-support", "import", "export"],
      },
      {
        id: "operations",
        title: "Operations",
        description: "Fit Memos into your devices, your hardware, and the rest of your stack.",
        slugs: ["beautiful-design", "pwa-support", "customizable-ui", "cross-platform", "performance", "lightweight", "api-first"],
      },
    ],
  },
] as const satisfies readonly FeatureChapterDefinition[];

const FEATURE_GROUPS: readonly FeatureGroupDefinition[] = FEATURE_CHAPTERS.flatMap<FeatureGroupDefinition>((chapter) => chapter.groups);

function FeatureGroup({ group }: { group: FeatureGroupDefinition }) {
  return (
    <div id={group.id} className="scroll-mt-24">
      <div className="mb-10 flex flex-col items-center text-center">
        <h3 className="font-serif text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-100">{group.title}</h3>
        <p className="mt-3 max-w-md text-pretty text-sm leading-7 text-zinc-600 sm:text-base dark:text-zinc-300">{group.description}</p>
      </div>
      <LinkGrid
        items={group.slugs.map((slug) => {
          const feature = FEATURES[slug];
          const Icon = feature.icon;
          return {
            href: `/features/${slug}`,
            title: feature.title,
            description: feature.description,
            icon: <Icon aria-hidden="true" className="size-5 stroke-[1.7]" />,
            badge: "wip" in feature && feature.wip ? "WIP" : undefined,
          };
        })}
      />
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <main className="flex flex-1 flex-col bg-white dark:bg-zinc-950">
      <JsonLdScript data={breadcrumbJsonLd} />

      <PageHero
        eyebrow="Features"
        title={
          <>
            Everything begins with <HeroAccent>a memo.</HeroAccent>
          </>
        }
        lead="Write a memo in Markdown, find it again by search, tag, or date, share only what you choose, and run it all on a server you pick."
        actions={[
          { label: "Install Memos", href: "/docs/getting-started", showArrow: true },
          { label: "Try Live Demo", href: "https://demo.usememos.com/" },
        ]}
      >
        <AnchorPills
          label="Feature groups"
          items={FEATURE_GROUPS.map((group) => ({ href: `#${group.id}`, label: group.title, count: group.slugs.length }))}
        />
        <div className="mt-14 sm:mt-16">
          <MemoAnatomyShowcase />
        </div>
      </PageHero>

      {FEATURE_CHAPTERS.map((chapter) => (
        <section
          key={chapter.id}
          aria-labelledby={`${chapter.id}-title`}
          className={chapter.surface === "quiet" ? "bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24" : "py-16 sm:py-20 lg:py-24"}
        >
          <div className="site-container">
            <ChapterHeader id={`${chapter.id}-title`} eyebrow={chapter.eyebrow} title={chapter.title} description={chapter.description} />
            <div className="mt-16 space-y-20 sm:mt-20 lg:space-y-24">
              {chapter.groups.map((group) => (
                <FeatureGroup key={group.id} group={group} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <StartSection description="Install Memos on your server or try the live demo before you decide." />
    </main>
  );
}

import { HomeFindViews, type ViewId } from "@/features/marketing/components/home-find-views";
import { HomeOwnCommand } from "@/features/marketing/components/home-own-command";
import { COMMAND_NOTES } from "@/features/marketing/components/home-own-section";
import { MemoAnatomyFigure } from "@/features/marketing/components/memo-anatomy-figure";
import { MemoAnatomyShowcase } from "@/features/marketing/components/memo-anatomy-showcase";
import type { FeatureSlug } from "@/features/marketing/data/features";

/**
 * The product proof for a feature page, reused from the Homepage. A feature gets one only when an
 * existing reconstruction truthfully shows it; everything else shows no decorative stand-in.
 */
const SHOWCASE: Partial<Record<FeatureSlug, { kind: "memo" } | { kind: "find"; view: ViewId } | { kind: "command" }>> = {
  "markdown-support": { kind: "memo" },
  "media-integration": { kind: "memo" },
  "quick-capture": { kind: "memo" },
  "instant-save": { kind: "memo" },
  "public-sharing": { kind: "memo" },
  "universal-search": { kind: "find", view: "search" },
  tags: { kind: "find", view: "search" },
  "timeline-view": { kind: "find", view: "calendar" },
  "self-hosted": { kind: "command" },
  "no-dependencies": { kind: "command" },
  "database-support": { kind: "command" },
  lightweight: { kind: "command" },
  "data-ownership": { kind: "command" },
};

export function hasFeatureShowcase(slug: FeatureSlug) {
  return slug in SHOWCASE;
}

export function FeatureShowcase({ slug }: { slug: FeatureSlug }) {
  const showcase = SHOWCASE[slug];
  if (!showcase) return null;
  if (showcase.kind === "memo") return <MemoAnatomyShowcase />;
  if (showcase.kind === "find") return <HomeFindViews initialView={showcase.view} />;
  return (
    <div className="rounded-2xl bg-zinc-950 px-5 py-10 sm:px-8 sm:py-14">
      <MemoAnatomyFigure notes={COMMAND_NOTES} tone="inverse">
        <HomeOwnCommand />
      </MemoAnatomyFigure>
    </div>
  );
}

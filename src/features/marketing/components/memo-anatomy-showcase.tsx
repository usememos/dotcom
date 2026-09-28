import { CheckSquareIcon, GlobeIcon, LinkIcon, MapPinIcon, MoreVerticalIcon, SquareIcon } from "lucide-react";
import Image from "next/image";
import styles from "@/features/marketing/components/home-hero.module.css";
import { type AnatomyNote, MemoAnatomyFigure } from "@/features/marketing/components/memo-anatomy-figure";
import { InlineTagText, MockAvatar, ReactionPills } from "@/features/marketing/components/memo-card";

/**
 * What one memo can carry, each verified against Memos v0.31 (proto/api/v1/memo_service.proto and
 * the MemoView components). Each `id` matches a `data-anchor` on the card, which its arrow targets.
 * `top` sets each note a little above or below its part, so the arrow curves in rather than running flat.
 */
export const MEMO_NOTES: readonly AnatomyNote[] = [
  { id: "space", label: "Share into a Space", side: "left", top: "0.9rem" },
  { id: "markdown", label: "Markdown and #tags", side: "left", top: "5.25rem" },
  { id: "attachments", label: "Photos and files", side: "left", top: "16.4rem" },
  { id: "links", label: "Link related memos", side: "left", top: "27.7rem" },
  { id: "pinned", label: "Pin it to the top", side: "right", top: "-1.6rem", target: "corner" },
  { id: "visibility", label: "Choose who can see it", side: "right", top: "3.45rem" },
  { id: "location", label: "Remember the place", side: "right", top: "23.4rem" },
  { id: "social", label: "Reactions and comments", side: "right", top: "33.7rem" },
];

/**
 * Bob's golden-hour memo from the official demo seed, with its real attachment
 * (store/seed/sqlite/01__dump.sql, extracted to public/home/golden-hour-trail.png), drawn in the
 * product's tokens at a readable scale. The checklist and linked memo are added to show every part.
 */
function MemoAnatomyCard() {
  return (
    <div
      data-anatomy-card
      className="text-sm leading-6 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_24px_64px_-12px_rgba(24,24,27,0.16)] dark:shadow-none rounded-xl"
    >
      <article className={`${styles.memoSurface} relative !rounded-xl !rounded-b-none !p-5`}>
        {/* The product marks pinned memos with a folded top-right corner. */}
        <span
          data-anchor="pinned"
          className="absolute -top-px -right-px size-6 rounded-tr-xl bg-amber-400 [clip-path:polygon(0_0,100%_0,100%_100%)] dark:bg-amber-300"
        />
        <div data-anchor="space" className="flex items-center justify-between gap-3 text-xs text-[var(--mock-muted)]">
          <span className="flex min-w-0 items-center gap-1.5">
            <MockAvatar name="Bob" />
            <span className="font-medium text-[var(--mock-ink)]">Bob</span>
            <span aria-hidden="true">·</span>3 hours ago
            <span className="ml-1 inline-flex items-center gap-1 truncate rounded-full border border-[var(--mock-border)] px-2 text-[11px]">
              <span aria-hidden="true">🌍</span>Travel
            </span>
          </span>
          <span data-anchor="visibility" className="mr-4 flex items-center gap-2">
            <GlobeIcon className="size-3.5" />
            <MoreVerticalIcon className="size-3.5" />
          </span>
        </div>

        <p data-anchor="markdown" className="mt-3 text-base font-semibold">
          🌅 Golden hour at Point Reyes
        </p>
        <p className="mt-1">
          <InlineTagText text="The camera couldn’t hold the colors, so here’s my minimal-art rendition instead. #travel/hikes" />
        </p>
        <ul className="mt-1.5 space-y-0.5">
          <li className="flex items-center gap-2">
            <CheckSquareIcon className="size-4 shrink-0 text-[var(--mock-accent)]" />
            <span className="text-[var(--mock-muted)] line-through">Lighthouse trail before sunset</span>
          </li>
          <li className="flex items-center gap-2">
            <SquareIcon className="size-4 shrink-0 text-[var(--mock-muted)]" />
            Come back for the elephant seals
          </li>
        </ul>

        <Image
          data-anchor="attachments"
          src="/home/golden-hour-trail.png"
          alt=""
          width={480}
          height={300}
          loading="lazy"
          className="mt-3 aspect-[5/2] w-full rounded-lg object-cover object-[center_60%]"
        />

        <p data-anchor="location" className="mt-3 flex items-center gap-1.5 text-xs text-[var(--mock-muted)]">
          <MapPinIcon className="size-3.5" />
          Point Reyes, California, United States
        </p>
        <p data-anchor="links" className="mt-1.5 flex items-center justify-between gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-1.5 text-[var(--mock-accent)]">
            <LinkIcon className="size-3.5 shrink-0" />
            <span className="truncate">Coast trip packing list</span>
          </span>
          <span className="shrink-0 text-[var(--mock-muted)] opacity-70">Referencing</span>
        </p>
        <ReactionPills
          reactions={[
            { emoji: "🔥", count: 1 },
            { emoji: "💛", count: 1 },
            { emoji: "👏", count: 1 },
          ]}
          className="mt-3 text-xs"
        />
      </article>
      {/* Comments hang off the card's bottom edge, as in the product's MemoCommentListView. */}
      <div
        data-anchor="social"
        className="rounded-b-xl border border-t-0 border-[var(--mock-border)] bg-[var(--mock-card)] px-5 pt-2 pb-3 text-xs"
      >
        <p className="text-[11px] text-[var(--mock-muted)]">
          Comments <span className="tabular-nums">2</span>
        </p>
        <ul className="mt-1.5 space-y-1.5">
          <li className="flex items-center gap-2">
            <MockAvatar name="Sam" className="size-4" />
            <span className="truncate">Okay, the gradient sky is gorgeous. Which trail is this?</span>
          </li>
          <li className="flex items-center gap-2">
            <MockAvatar name="Bob" className="size-4" />
            <span className="truncate">The stretch north of the lighthouse. Tap the 📍 on the memo.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/** The memo's anatomy: the card at the center, short notes pointing at what it can carry. */
export function MemoAnatomyShowcase() {
  return (
    <figure className="mt-14 w-full sm:mt-16">
      <MemoAnatomyFigure notes={MEMO_NOTES}>
        <div aria-hidden="true" className={styles.productTokens} data-testid="memo-anatomy">
          <MemoAnatomyCard />
        </div>
      </MemoAnatomyFigure>
      <figcaption className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-2 text-left text-sm font-medium text-brand-700 xl:hidden dark:text-brand-300">
        {MEMO_NOTES.map((note) => (
          <span key={note.id}>{note.label}</span>
        ))}
      </figcaption>
    </figure>
  );
}

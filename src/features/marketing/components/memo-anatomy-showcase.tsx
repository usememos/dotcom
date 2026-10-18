import { CheckIcon, ChevronRightIcon, GlobeIcon, LinkIcon, MapPinIcon, MoreVerticalIcon, SquareIcon } from "lucide-react";
import Image from "next/image";
import { type AnatomyNote, MemoAnatomyFigure } from "@/features/marketing/components/memo-anatomy-figure";
import styles from "@/features/marketing/components/memo-anatomy-showcase.module.css";
import { MockAvatar, ReactionPills } from "@/features/marketing/components/memo-card";

/**
 * Each label follows its actual controls, rather than a fixed position on the card.
 * Header arrows approach diagonally through the gaps around their controls.
 */
export const MEMO_NOTES: readonly AnatomyNote[] = [
  { id: "space", label: "Share into a Space", side: "left", offsetY: -56, target: "top-left" },
  { id: "markdown", label: "Markdown and #tags", side: "right", offsetY: 12, target: "right" },
  { id: "attachments", label: "Photos and files", side: "left", offsetY: -24, target: "left" },
  { id: "links", label: "Link related memos", side: "left", offsetY: 20, target: "left" },
  { id: "pinned", label: "Pin it to the top", side: "right", offsetY: -36, target: "corner" },
  { id: "visibility", label: "Choose who can see it", side: "right", offsetY: 30, target: "bottom-right" },
  { id: "location", label: "Remember the place", side: "left", offsetY: -20, target: "left" },
  { id: "social", label: "Reactions and comments", side: "right", offsetY: -24, anchors: ["reactions", "comments"], target: "right" },
];

/**
 * Bob's golden-hour memo from the official demo seed, with its real attachment
 * (store/seed/sqlite/01__dump.sql, extracted to public/home/golden-hour-trail.png), drawn in the
 * product's tokens at a readable scale. The checklist and linked memo are added to show every part.
 */
function MemoAnatomyCard() {
  return (
    <div data-anatomy-card className={styles.card}>
      <article className={styles.body}>
        {/* The product marks pinned memos with a folded top-right corner. */}
        <span data-anchor="pinned" className={styles.pinned} />
        <div className={styles.header}>
          <span className={styles.identity}>
            <MockAvatar name="Bob" />
            <span className="font-medium text-[var(--mock-ink)]">Bob</span>
            <span aria-hidden="true">·</span>3 hours ago
            <span data-anchor="space" className={styles.space}>
              <span aria-hidden="true">🌍</span>Travel
            </span>
          </span>
          <span className={styles.actions}>
            <span className={styles.action}>
              <GlobeIcon data-anchor="visibility" className="size-3.5" />
            </span>
            <span className={styles.action}>
              <MoreVerticalIcon className="size-3.5" />
            </span>
          </span>
        </div>

        <p className="mt-2 text-base leading-6 font-semibold">🌅 Golden hour at Point Reyes</p>
        <p className="mt-1">
          The camera couldn’t hold the colors, so here’s my minimal-art rendition instead.{" "}
          <span data-anchor="markdown" className={styles.tag}>
            #travel/hikes
          </span>
        </p>
        <ul className="mt-1.5 space-y-0.5">
          <li className="flex items-center gap-2">
            <span className={styles.checked}>
              <CheckIcon className="size-3.5" strokeWidth={2.3} />
            </span>
            <span className="text-[var(--mock-muted)] line-through">Lighthouse trail before sunset</span>
          </li>
          <li className="flex items-center gap-2">
            <SquareIcon className="size-4 shrink-0 text-[var(--mock-checkbox)]" strokeWidth={1} />
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
          className={styles.attachment}
        />

        <div className={styles.metadata}>
          <p className={styles.metadataRow}>
            <MapPinIcon data-anchor="location" className="size-4 shrink-0" strokeWidth={1.8} />
            <span className="truncate">Point Reyes, California, United States</span>
          </p>
          <p className={styles.metadataRow}>
            <LinkIcon data-anchor="links" className="size-4 shrink-0" strokeWidth={1.8} />
            <span className="min-w-0 flex-1 truncate">Coast trip packing list</span>
            <span className={styles.detail}>Referencing</span>
          </p>
        </div>
        <div className="mt-2 flex">
          <div data-anchor="reactions" className="inline-flex">
            <ReactionPills
              reactions={[
                { emoji: "🔥", count: 1 },
                { emoji: "💛", count: 1 },
                { emoji: "👏", count: 1 },
              ]}
              className="text-xs"
            />
          </div>
        </div>
      </article>
      {/* Comments hang off the card's bottom edge, as in the product's MemoCommentListView. */}
      <div className={styles.comments}>
        <div className={styles.commentsHeader}>
          <p data-anchor="comments">
            Comments <span className="ml-1.5 tabular-nums">2</span>
          </p>
          <span className="inline-flex items-center gap-0.5">
            View all <ChevronRightIcon className="size-3" />
          </span>
        </div>
        <ul>
          <li className={styles.comment}>
            <MockAvatar name="Sam" className="size-4" />
            <span className="truncate">
              <span className="font-medium">Sam</span> Okay, the gradient sky is gorgeous. Which trail is this?
            </span>
          </li>
          <li className={styles.comment}>
            <MockAvatar name="Bob" className="size-4" />
            <span className="truncate">
              <span className="font-medium">Bob</span> The stretch north of the lighthouse. Tap the 📍 on the memo.
            </span>
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
        <div aria-hidden="true" className={styles.preview} data-testid="memo-anatomy">
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

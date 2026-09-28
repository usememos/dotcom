import { CheckSquareIcon, LinkIcon, MapPinIcon, MoreVerticalIcon, SquareIcon, UserRoundIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import styles from "@/features/marketing/components/home-hero.module.css";
import { type HomeMemo, INLINE_TAG_PATTERN } from "@/features/marketing/data/home-memos";

export function relativeDay(daysAgo: number) {
  return daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;
}

/**
 * The product's default avatar (web/src/components/UserAvatar.tsx): a filled portrait on a
 * pastel circle whose hue comes from a hash of the name, so each demo person keeps their color.
 */
export function MockAvatar({ name, className = "size-5" }: { name: string; className?: string }) {
  let hash = 0;
  for (const character of name.toLowerCase()) hash = (hash * 31 + (character.codePointAt(0) ?? 0)) | 0;
  const style = { "--avatar-hue": `${((hash >>> 0) % 12) * 30}deg` } as CSSProperties;
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[oklch(0.82_0.09_var(--avatar-hue))] text-[oklch(0.5_0.1_var(--avatar-hue))] dark:bg-[oklch(0.42_0.09_var(--avatar-hue))] dark:text-[oklch(0.85_0.06_var(--avatar-hue))] ${className}`}
    >
      <UserRoundIcon className="size-full translate-y-[12.5%]" fill="currentColor" strokeWidth={0} />
    </span>
  );
}

/** Emoji reactions as the product's quiet pills: the emoji, then how many people chose it. */
export function ReactionPills({ reactions, className = "" }: { reactions: { emoji: string; count: number }[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {reactions.map((reaction) => (
        <span
          key={reaction.emoji}
          className="inline-flex h-[1.6em] items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--mock-selected)_70%,transparent)] px-[0.6em] text-[var(--mock-muted)]"
        >
          <span className="leading-none">{reaction.emoji}</span>
          <span className="text-[0.85em] tabular-nums opacity-70">{reaction.count}</span>
        </span>
      ))}
    </div>
  );
}

/** Wraps case-insensitive matches of `query` in a search highlight, as Quick Find does. */
function highlight(text: string, query: string | undefined, keyPrefix: string): ReactNode {
  if (!query) return text;
  const pattern = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i");
  // Splitting on a capturing pattern puts every match at an odd index.
  return text.split(pattern).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${keyPrefix}-${index}`} className={styles.memoMatch}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/** A paragraph with its #tags inline, where they were typed. */
export function InlineTagText({ text, match }: { text: string; match?: string }) {
  return (
    <>
      {text.split(INLINE_TAG_PATTERN).map((part, index) =>
        // Splitting on a capturing pattern puts every matched tag at an odd index.
        index % 2 === 1 ? (
          <span key={`${index}-${part}`} translate="no" className={styles.memoTag}>
            {part}
          </span>
        ) : (
          highlight(part, match, `${index}`)
        ),
      )}
    </>
  );
}

interface MemoCardProps {
  memo: HomeMemo;
  /**
   * The hero timeline is the one accessible, linkable reconstruction. Copies elsewhere on the
   * page sit inside decorative, `aria-hidden` fragments, so they render no ids or links.
   */
  anchored?: boolean;
  /** Highlights a search term in the memo text. */
  match?: string;
  /** Shows only the opening lines and a one-line summary of what else the memo holds. */
  compact?: boolean;
  children?: ReactNode;
}

function CompactSummary({ memo }: { memo: HomeMemo }) {
  const open = memo.tasks?.filter((task) => !task.done).length ?? 0;
  const items = [
    memo.tasks ? `${memo.tasks.length - open}/${memo.tasks.length} done` : null,
    memo.quote ? "Quote" : null,
    memo.code ? "Code" : null,
    memo.link ? "Link" : null,
    memo.referencing ? `${memo.referencing.length} linked` : null,
    memo.location ? memo.location.split(",")[0] : null,
  ].filter(Boolean);
  if (items.length === 0) return null;
  return <p className="mt-1 truncate text-[9px] text-[var(--mock-muted)]">{items.join(" · ")}</p>;
}

export function MemoCard({ memo, anchored = false, match, compact = false, children }: MemoCardProps) {
  const labelId = anchored ? `home-memo-${memo.id}-label` : undefined;
  return (
    <article id={anchored ? `home-memo-${memo.id}` : undefined} aria-labelledby={labelId} className={styles.memoSurface}>
      <div className="flex items-center justify-between text-[9px] text-[var(--mock-muted)]">
        <span>{relativeDay(memo.daysAgo)}</span>
        <MoreVerticalIcon aria-hidden="true" className="size-3" />
      </div>
      <div id={labelId} className="mt-1 space-y-1 text-[11px] leading-[18px] text-[var(--mock-ink)]">
        {memo.heading ? <p className="text-[12.5px] leading-5 font-semibold">{memo.heading}</p> : null}
        {!compact && memo.lines
          ? memo.lines.map((line) => (
              <p key={line.label}>
                <strong className="font-semibold">{line.label}</strong> {line.text}
              </p>
            ))
          : null}
        {!compact && memo.quote ? (
          <blockquote className="border-l-2 border-[var(--mock-border)] pl-2 text-[var(--mock-muted)] italic">{memo.quote}</blockquote>
        ) : null}
        <p>
          <InlineTagText text={memo.text} match={match} />
        </p>
      </div>
      {children}
      {compact ? <CompactSummary memo={memo} /> : null}
      {!compact && memo.tasks ? (
        <ul className="mt-1 space-y-0.5 text-[10px] leading-4">
          {memo.tasks.map((task) => (
            <li key={task.text} className="flex items-center gap-1.5">
              {task.done ? (
                <CheckSquareIcon aria-hidden="true" className="size-3 shrink-0 text-[var(--mock-accent)]" />
              ) : (
                <SquareIcon aria-hidden="true" className="size-3 shrink-0 text-[var(--mock-muted)]" />
              )}
              <span className="sr-only">{task.done ? "Completed: " : "To do: "}</span>
              <span className={task.done ? "text-[var(--mock-muted)] line-through" : undefined}>{task.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {!compact && memo.code ? (
        <pre className="mt-1.5 rounded-[6px] border border-[var(--mock-border)] bg-[var(--mock-canvas)] px-2 py-1 font-mono text-[9px] leading-4 whitespace-pre-wrap break-all">
          <code translate="no">{memo.code}</code>
        </pre>
      ) : null}
      {!compact && memo.link ? (
        anchored ? (
          <a className={styles.memoLink} href={memo.link.href} target="_blank" rel="noopener noreferrer">
            {memo.link.label}
          </a>
        ) : (
          <span className={styles.memoLink}>{memo.link.label}</span>
        )
      ) : null}
      {!compact && memo.referencing ? (
        <ul className="mt-1.5 space-y-0.5">
          {memo.referencing.map((target) => (
            <li key={target.id} className="flex items-center justify-between gap-2 text-[9.5px]">
              {anchored ? (
                <a className={`${styles.memoReference} min-w-0`} href={`#home-memo-${target.id}`}>
                  <LinkIcon aria-hidden="true" className="size-2.5 shrink-0" />
                  <span className="truncate">{target.label}</span>
                </a>
              ) : (
                <span className={`${styles.memoReference} min-w-0`}>
                  <LinkIcon aria-hidden="true" className="size-2.5 shrink-0" />
                  <span className="truncate">{target.label}</span>
                </span>
              )}
              <span className="shrink-0 text-[var(--mock-muted)] opacity-70">Referencing</span>
            </li>
          ))}
        </ul>
      ) : null}
      {!compact && memo.location ? (
        <p className="mt-1.5 flex items-center gap-1 text-[9px] text-[var(--mock-muted)]">
          <MapPinIcon aria-hidden="true" className="size-2.5" />
          {memo.location}
        </p>
      ) : null}
      {!compact && memo.reactions ? <ReactionPills reactions={memo.reactions} className="mt-2 text-[10px]" /> : null}
    </article>
  );
}

import styles from "@/features/marketing/components/editor-showcase.module.css";
import {
  EDITOR_PRESERVE_AFTER,
  EDITOR_PRESERVE_BEFORE,
  EDITOR_PRESERVE_EDITED_LINE,
  EDITOR_SIZE_COMPARISON,
  EDITOR_TYPING_SHORTCUTS,
} from "@/features/marketing/data/editor";
import { cn } from "@/shared/lib/utils";

function SourcePane({ title, note, text, tone }: { title: string; note: string; text: string; tone: "before" | "after" }) {
  const lines = text.replace(/\n$/, "").split("\n");

  return (
    <figure className="min-w-0">
      <figcaption className="flex items-baseline justify-between gap-3 px-1 text-sm">
        <span className="font-semibold">{title}</span>
        <span className={styles.muted}>{note}</span>
      </figcaption>
      <pre className={`${styles.source} mt-3`}>
        <code translate="no">
          {lines.map((line, index) => {
            const edited = line.startsWith(EDITOR_PRESERVE_EDITED_LINE);
            return (
              <span
                // Lines repeat (blank lines), so the index is the identity here.
                key={`${tone}-${index}-${line}`}
                className={cn(styles.sourceLine, edited && (tone === "after" ? styles.sourceChanged : styles.sourceEdited))}
              >
                {line || " "}
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}

/**
 * What the serializer writes after one paragraph is edited: the heading's
 * underline, the `*` bullets, and the `1)` numbering stay as they were loaded.
 * `src/features/marketing/data/editor.test.ts` performs the edit for real.
 */
export function PreservedSourceFigure() {
  return (
    <div>
      <div className="grid gap-6">
        <SourcePane title="Loaded" note="Markdown from somewhere else" text={EDITOR_PRESERVE_BEFORE} tone="before" />
        <SourcePane title="Saved" note="after editing one paragraph" text={EDITOR_PRESERVE_AFTER} tone="after" />
      </div>
      <p className={`${styles.muted} mt-5 max-w-2xl text-sm leading-7`}>
        Only the edited paragraph was rewritten. The underlined heading, the asterisk bullets, and the parenthesis numbering are not the
        editor&apos;s own style, and it left them alone.
      </p>
    </div>
  );
}

/** Block and inline typing shortcuts, as docs/syntax.md specifies them. */
export function ShortcutLedger() {
  return (
    <dl>
      {EDITOR_TYPING_SHORTCUTS.map((shortcut) => (
        <div key={shortcut.typed} className={styles.ledgerRow}>
          <dt>
            <kbd className={styles.specimen}>{shortcut.typed}</kbd>
          </dt>
          <dd className="text-sm leading-6">{shortcut.becomes}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A code surface on ink, with no highlighting. */
export function CodeFrame({ title, code, className }: { title: string; code: string; className?: string }) {
  return (
    <div className={cn(styles.codeFrame, className)}>
      <div className={styles.codeFrameTitle}>{title}</div>
      <pre className={styles.codeFrameBody}>
        <code translate="no">{code}</code>
      </pre>
    </div>
  );
}

/**
 * Minified and gzipped size of this editor next to other editors set up for
 * the same job, as the editor project measured them. One measure, one scale.
 */
export function SizeComparison() {
  const max = Math.max(...EDITOR_SIZE_COMPARISON.map((row) => row.kb));

  return (
    <div>
      {EDITOR_SIZE_COMPARISON.map((row) => (
        <div key={row.name} className={styles.barRow}>
          <div className="min-w-0">
            <p className={cn("truncate font-mono text-[13px]", row.subject && "text-white")} title={row.detail}>
              {row.name}
            </p>
          </div>
          <div className={styles.barTrack} aria-hidden="true">
            <div className={cn(styles.bar, row.subject && styles.barSubject)} style={{ width: `${(row.kb / max) * 100}%` }} />
          </div>
          <p className={cn("font-mono text-[13px] tabular-nums", row.subject && "text-white")}>{row.kb} KB</p>
        </div>
      ))}
    </div>
  );
}

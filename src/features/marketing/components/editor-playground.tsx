"use client";

import { CheckIcon, CopyIcon, RotateCcwIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import styles from "@/features/marketing/components/editor-showcase.module.css";
import { EDITOR_PLAYGROUND_SAMPLE } from "@/features/marketing/data/editor";
import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";

// The editor owns a contentEditable root, so it renders on the client only.
// The Markdown pane carries the sample in the server HTML meanwhile.
const EditorPlaygroundLive = dynamic(() => import("@/features/marketing/components/editor-playground-live"), {
  ssr: false,
  loading: () => (
    <div className="px-5 py-5 sm:px-7 sm:py-6" aria-hidden="true">
      <div className="h-4 w-2/5 animate-pulse rounded bg-[var(--ed-line)]" />
      <div className="mt-5 h-3 w-full animate-pulse rounded bg-[var(--ed-paper)]" />
      <div className="mt-3 h-3 w-11/12 animate-pulse rounded bg-[var(--ed-paper)]" />
      <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-[var(--ed-paper)]" />
    </div>
  ),
});

type Mode = "rich" | "source";

/**
 * The page's signature: a real `@usememos/editor` on white beside the Markdown
 * it stores, on ink. Everything the editor emits is shown verbatim.
 */
export function EditorPlayground() {
  const [markdown, setMarkdown] = useState(EDITOR_PLAYGROUND_SAMPLE);
  const [mode, setMode] = useState<Mode>("rich");
  const [editable, setEditable] = useState(true);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const { copied, copy } = useCopyToClipboard();
  const outputId = useId();

  useEffect(
    () => () => {
      if (submitTimer.current !== undefined) clearTimeout(submitTimer.current);
    },
    [],
  );

  const onChange = useCallback((value: string) => {
    setMarkdown(value);
    setTick((count) => count + 1);
  }, []);

  const onSubmit = useCallback((value: string) => {
    setSubmitted(`onSubmit received ${value.length.toLocaleString("en-US")} characters`);
    if (submitTimer.current !== undefined) clearTimeout(submitTimer.current);
    submitTimer.current = setTimeout(() => setSubmitted(null), 3000);
  }, []);

  const isSample = markdown === EDITOR_PLAYGROUND_SAMPLE;

  return (
    <div className={`${styles.frame} overflow-hidden`}>
      <div className={`${styles.chrome} flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 sm:px-4`}>
        <div role="group" aria-label="Editing mode" className={styles.segment}>
          {(["rich", "source"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={mode === option}
              onClick={() => setMode(option)}
              className={styles.segmentButton}
            >
              {option === "rich" ? "Blocks" : "Source"}
            </button>
          ))}
        </div>
        <button type="button" aria-pressed={!editable} onClick={() => setEditable((value) => !value)} className={styles.toolButton}>
          Read-only
        </button>
        <button
          type="button"
          onClick={() => setMarkdown(EDITOR_PLAYGROUND_SAMPLE)}
          disabled={isSample}
          className={`${styles.toolButton} ml-auto`}
        >
          <RotateCcwIcon aria-hidden="true" className="size-3.5" />
          Reset sample
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
        {/* The editor grows with its document; on desktop the Markdown pane takes the same height and scrolls inside it. */}
        <div className="max-h-[28rem] min-h-[20rem] overflow-y-auto text-[15px] sm:text-base lg:max-h-none lg:min-h-[26rem] lg:overflow-visible">
          <EditorPlaygroundLive value={markdown} mode={mode} editable={editable} onChange={onChange} onSubmit={onSubmit} />
        </div>

        <div className={`${styles.ink} relative lg:min-h-[26rem]`}>
          <div className="flex flex-col lg:absolute lg:inset-0">
            <div className="flex items-center gap-3 px-4 pt-3 pb-2 sm:px-5">
              <label htmlFor={outputId} className="text-sm font-semibold text-white">
                Markdown
              </label>
              <span key={tick} className={`${styles.count} ${styles.inkMuted} text-xs tabular-nums`}>
                {markdown.length.toLocaleString("en-US")} characters
              </span>
              <button
                type="button"
                onClick={() => copy(markdown)}
                aria-label={copied ? "Markdown copied to clipboard" : "Copy Markdown to clipboard"}
                className={`${styles.inkButton} ml-auto`}
              >
                {copied ? <CheckIcon aria-hidden="true" className="size-3.5" /> : <CopyIcon aria-hidden="true" className="size-3.5" />}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre id={outputId} className={`${styles.output} max-h-[18rem] min-h-0 flex-1 overflow-auto px-4 pb-5 sm:px-5 lg:max-h-none`}>
              <code translate="no">{markdown}</code>
            </pre>
          </div>
        </div>
      </div>

      <div
        className={`${styles.chrome} flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-b-0 px-4 py-2.5 text-xs leading-6 sm:px-5`}
      >
        <span className={styles.muted}>
          <kbd className={styles.key}>/</kbd> opens the block menu, <kbd className={styles.key}>#</kbd> tags,{" "}
          <kbd className={styles.key}>@</kbd> people, <kbd className={styles.key}>:</kbd> emoji. Select text for the toolbar.
        </span>
        <span className={`${styles.muted} ml-auto`} aria-live="polite">
          {submitted ?? (
            <>
              <kbd className={styles.key}>⌘</kbd> or <kbd className={styles.key}>Ctrl</kbd> + <kbd className={styles.key}>Enter</kbd> calls
              onSubmit
            </>
          )}
        </span>
      </div>
    </div>
  );
}

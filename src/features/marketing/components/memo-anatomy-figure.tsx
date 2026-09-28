"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export interface AnatomyNote {
  id: string;
  label: string;
  side: "left" | "right";
  /** The note's vertical center, from the top of the card; offset from its part so the arrow curves. */
  top: string;
  /** Where the arrow lands: level with its part at the card edge (default), or on the card's top-right corner. */
  target?: "edge" | "corner";
}

interface Arrow {
  id: string;
  line: string;
  head: string;
}

/** Room between a note and the card for its arrow to curve. */
const GUTTER_CLASS = { left: "right-full mr-20 text-right", right: "left-full ml-20 text-left" } as const;

/**
 * Draws one arrow per note from the note's inner edge to the exact card part it names, found by
 * the matching `data-anchor`. Each arrow ends at the card edge level with that part, or on the
 * card's top-right corner for `target: "corner"`. Arrows are recomputed whenever the card or figure
 * resizes (fonts, the image, the viewport), so they never drift from what they point at.
 */
function measureArrows(root: HTMLElement, notes: readonly AnatomyNote[]): Arrow[] {
  const box = root.getBoundingClientRect();
  const card = root.querySelector("[data-anatomy-card]")?.getBoundingClientRect();
  if (!card) return [];
  return notes.flatMap((note, index) => {
    const label = root.querySelector(`[data-note="${note.id}"]`)?.getBoundingClientRect();
    const anchor = root.querySelector(`[data-anchor="${note.id}"]`)?.getBoundingClientRect();
    // Notes are hidden below `xl`, where the stacked caption takes over.
    if (!label || !anchor || label.width === 0) return [];

    const sx = (note.side === "left" ? label.right + 10 : label.left - 10) - box.left;
    const sy = label.top + label.height / 2 - box.top;
    const pinned = note.target === "corner";
    const ex = (pinned ? card.right - 8 : note.side === "left" ? card.left - 6 : card.right + 6) - box.left;
    const ey = (pinned ? card.top + 8 : anchor.top + anchor.height / 2) - box.top;

    // A quadratic curve that sags a little, with a slightly different bend per note so the set reads hand-drawn.
    const dx = ex - sx;
    const dy = ey - sy;
    const length = Math.hypot(dx, dy) || 1;
    const bend = Math.min(26, length * (0.16 + (index % 3) * 0.05));
    const direction = note.side === "left" ? 1 : -1;
    const cx = (sx + ex) / 2 - (dy / length) * bend * direction;
    const cy = (sy + ey) / 2 + (dx / length) * bend * direction;

    // The arrowhead follows the curve's final tangent.
    const angle = Math.atan2(ey - cy, ex - cx);
    const wing = (spread: number) => `${ex - 8 * Math.cos(angle + spread)} ${ey - 8 * Math.sin(angle + spread)}`;

    return [{ id: note.id, line: `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`, head: `M${wing(0.5)} L${ex} ${ey} L${wing(-0.5)}` }];
  });
}

const TONE_CLASS = {
  light: { note: "text-brand-700 dark:text-brand-300", arrow: "text-brand-500 dark:text-brand-300" },
  // For always-dark chapters, where `dark:` variants alone would not provide contrast in the light theme.
  inverse: { note: "text-brand-300", arrow: "text-brand-300" },
} as const;

interface AnnotatedFigureProps {
  notes: readonly AnatomyNote[];
  children: ReactNode;
  tone?: keyof typeof TONE_CLASS;
  /** The artifact's width; notes and arrows sit outside it. */
  widthClass?: string;
}

export function MemoAnatomyFigure({ notes, children, tone = "light", widthClass = "max-w-[31rem]" }: AnnotatedFigureProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState<Arrow[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const draw = () => setArrows(measureArrows(root, notes));
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(root);
    const card = root.querySelector("[data-anatomy-card]");
    if (card) observer.observe(card);
    // The figure keeps a fixed width, so crossing the `xl` breakpoint (which shows the notes) only shows up as a viewport resize.
    window.addEventListener("resize", draw);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", draw);
    };
  }, [notes]);

  return (
    <div ref={rootRef} className={`relative mx-auto w-full text-left ${widthClass}`}>
      {children}
      {notes.map((note) => (
        <p
          key={note.id}
          data-note={note.id}
          style={{ top: note.top }}
          className={`absolute hidden -translate-y-1/2 text-[0.9375rem] font-medium whitespace-nowrap xl:block ${TONE_CLASS[tone].note} ${GUTTER_CLASS[note.side]}`}
        >
          {note.label}
        </p>
      ))}
      <svg
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 hidden size-full overflow-visible xl:block ${TONE_CLASS[tone].arrow}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {arrows.map((arrow) => (
          <g key={arrow.id} data-arrow={arrow.id}>
            <path d={arrow.line} />
            <path d={arrow.head} />
          </g>
        ))}
      </svg>
    </div>
  );
}

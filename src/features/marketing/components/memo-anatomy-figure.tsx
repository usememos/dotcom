"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export interface AnatomyNote {
  id: string;
  label: string;
  side: "left" | "right";
  /** Fixed placement for annotations on the deployment command. */
  top?: string;
  /** Otherwise follow the named controls, with this vertical offset in CSS pixels. */
  offsetY?: number;
  /** One label can explain two related controls, such as reactions and comments. */
  anchors?: readonly string[];
  target?: "edge" | "corner" | "left" | "right" | "top" | "bottom" | "top-left" | "bottom-right";
}

interface Arrow {
  id: string;
  line: string;
  head: string;
}

interface FigureLayout {
  arrows: Arrow[];
  tops: Record<string, number>;
}

/** Room between a note and the card for its arrow to curve. */
const GUTTER_CLASS = { left: "right-full mr-20 text-right", right: "left-full ml-20 text-left" } as const;

/**
 * Measure controls and labels in the overlay's coordinate system. Memo annotations land just
 * outside their named controls; deployment annotations retain their card-edge treatment.
 */
function measureFigure(root: HTMLElement, notes: readonly AnatomyNote[]): FigureLayout {
  const box = root.getBoundingClientRect();
  const card = root.querySelector("[data-anatomy-card]")?.getBoundingClientRect();
  const tops: Record<string, number> = {};
  if (!card) return { arrows: [], tops };
  const arrows = notes.flatMap((note, index) => {
    const label = root.querySelector(`[data-note="${note.id}"]`)?.getBoundingClientRect();
    const anchors = (note.anchors ?? [note.id]).flatMap((id) => {
      const rect = root.querySelector(`[data-anchor="${id}"]`)?.getBoundingClientRect();
      return rect ? [{ id, rect }] : [];
    });
    // Notes are hidden below `xl`, where the stacked caption takes over.
    if (!label || anchors.length === 0 || label.width === 0) return [];

    const sx = (note.side === "left" ? label.right + 10 : label.left - 10) - box.left;
    const centerY = anchors.reduce((sum, { rect }) => sum + rect.top + rect.height / 2, 0) / anchors.length;
    const sy = note.top === undefined ? centerY - box.top + (note.offsetY ?? 0) : label.top + label.height / 2 - box.top;
    if (note.top === undefined) tops[note.id] = sy;

    return anchors.map(({ id, rect }) => {
      const target = note.target ?? "edge";
      let ex = (note.side === "left" ? card.left - 6 : card.right + 6) - box.left;
      let ey = rect.top + rect.height / 2 - box.top;
      if (target === "corner") {
        // Leave the folded corner visible instead of drawing the head over it.
        ex = rect.right + 6 - box.left;
        ey = rect.top - 6 - box.top;
      } else if (target === "left" || target === "right") {
        ex = (target === "left" ? rect.left - 6 : rect.right + 6) - box.left;
      } else if (target === "top" || target === "bottom") {
        ex = rect.left + rect.width / 2 - box.left;
        ey = (target === "top" ? rect.top - 6 : rect.bottom + 6) - box.top;
      } else if (target === "top-left" || target === "bottom-right") {
        ex = (target === "top-left" ? rect.left - 6 : rect.right + 6) - box.left;
        ey = (target === "top-left" ? rect.top - 6 : rect.bottom + 6) - box.top;
      }

      const dx = ex - sx;
      const dy = ey - sy;
      const length = Math.hypot(dx, dy) || 1;
      const direction = note.side === "left" ? 1 : -1;
      let line: string;
      let angle: number;
      if (target === "edge") {
        // Preserve the deployment diagram's existing card-edge connectors.
        const bend = Math.min(26, length * (0.16 + (index % 3) * 0.05));
        const cx = (sx + ex) / 2 - (dy / length) * bend * direction;
        const cy = (sy + ey) / 2 + (dx / length) * bend * direction;
        line = `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`;
        angle = Math.atan2(ey - cy, ex - cx);
      } else {
        // Independent tangents keep the label end horizontal and aim the head at the control.
        const diagonal = Math.SQRT1_2;
        const entry = {
          left: [1, 0],
          right: [-1, 0],
          top: [0, 1],
          bottom: [0, -1],
          "top-left": [diagonal, diagonal],
          "bottom-right": [-diagonal, -diagonal],
          corner: [-diagonal, diagonal],
        }[target];
        const startHandle = Math.min(56, length / 3);
        const endHandle = Math.min(32, length / 3);
        const c1x = sx + direction * startHandle;
        const c2x = ex - entry[0] * endHandle;
        // No vertical overshoot: short connectors must not curl back into a hook.
        const c2y = Math.max(Math.min(sy, ey), Math.min(Math.max(sy, ey), ey - entry[1] * endHandle));
        line = `M${sx} ${sy} C${c1x} ${sy} ${c2x} ${c2y} ${ex} ${ey}`;
        angle = Math.atan2(ey - c2y, ex - c2x);
      }
      const headSize = target === "edge" ? 8 : 6;
      const wing = (spread: number) => `${ex - headSize * Math.cos(angle + spread)} ${ey - headSize * Math.sin(angle + spread)}`;

      return { id, line, head: `M${wing(0.5)} L${ex} ${ey} L${wing(-0.5)}` };
    });
  });
  return { arrows, tops };
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
  const [layout, setLayout] = useState<FigureLayout>({ arrows: [], tops: {} });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const draw = () => setLayout(measureFigure(root, notes));
    draw();
    const observer = new ResizeObserver(draw);
    // Anchors and labels can reflow without changing the card's total height.
    for (const element of [root, ...root.querySelectorAll("[data-anatomy-card], [data-anchor], [data-note]")]) observer.observe(element);
    document.fonts?.addEventListener("loadingdone", draw);
    root.addEventListener("load", draw, true);
    // The figure keeps a fixed width, so crossing the `xl` breakpoint (which shows the notes) only shows up as a viewport resize.
    window.addEventListener("resize", draw);
    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", draw);
      root.removeEventListener("load", draw, true);
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
          style={{
            top: note.top ?? layout.tops[note.id] ?? 0,
            visibility: note.top === undefined && layout.tops[note.id] === undefined ? "hidden" : undefined,
          }}
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
        {layout.arrows.map((arrow) => (
          <g key={arrow.id} data-arrow={arrow.id}>
            <path d={arrow.line} />
            <path d={arrow.head} />
          </g>
        ))}
      </svg>
    </div>
  );
}

import type { ComponentProps } from "react";
import { CopyCodeButton } from "@/features/editorial/components/copy-code-button";
import { cn } from "@/shared/lib/utils";

/**
 * Editorial (blog/changelog) code block.
 *
 * Mirrors the `figure.shiki > div[role="region"] > pre` shape that `global.css`
 * styles: the figure carries the Shiki class and custom properties so token
 * colors resolve, and the region owns the horizontal scroll.
 *
 * Props are picked explicitly rather than spread, so the presentational
 * metadata `rehype-code` attaches to `pre` (notably `icon`, an SVG string) never
 * reaches the DOM as an invalid attribute.
 */
export function EditorialCodeBlock({ title, className, style, children }: ComponentProps<"pre">) {
  return (
    <figure className={cn("group/code relative", className)} style={style}>
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: a horizontally scrollable region must be focusable, or keyboard users cannot scroll overflowing code. */}
      <div role="region" aria-label={title ? `${title} code block` : "Code block"} tabIndex={0}>
        <pre>{children}</pre>
      </div>
      <CopyCodeButton />
    </figure>
  );
}

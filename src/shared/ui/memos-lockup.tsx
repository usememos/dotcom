import type { SVGProps } from "react";
import { cn } from "@/shared/lib/utils";
import { lockupArtwork } from "./memos-lockup-artwork";

type MemosLockupProps = Omit<SVGProps<SVGSVGElement>, "children" | "viewBox" | "width" | "height"> & {
  height?: number;
  label?: string;
};

/** Official outlined lettering and bird, scaled together with their original padding. */
export function MemosLockup({ height = 34, label = "Memos", className, ...props }: MemosLockupProps) {
  // The visible bird occupies 24/34 of the small lockup's canvas height.
  const artwork = height * (24 / 34) <= 32 ? lockupArtwork.small : lockupArtwork.standard;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={artwork.viewBox}
      width={(height * artwork.width) / artwork.height}
      height={height}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    >
      {label ? <title>{label}</title> : null}
      <g transform={artwork.transform}>
        <path d={artwork.bird.d} transform={artwork.bird.transform} fill="currentColor" fillRule="evenodd" />
        <g transform={artwork.wordmark.transform}>
          <path d={artwork.wordmark.d} transform={artwork.wordmark.pathTransform} fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}

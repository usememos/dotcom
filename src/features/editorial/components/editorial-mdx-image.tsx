import Image, { type StaticImageData } from "next/image";
import type { ComponentProps } from "react";

/**
 * Image renderer for editorial MDX bodies.
 *
 * `remark-image` rewrites local markdown images into static imports, so at
 * runtime `src` is a `StaticImageData` object rather than the string the
 * intrinsic `img` prop type promises. Handing that to an intrinsic `<img>`
 * stringifies it to `[object Object]`; `next/image` consumes it and derives
 * intrinsic dimensions, which also removes the layout shift.
 */
export function EditorialMdxImage({ src, alt = "", ...props }: ComponentProps<"img">) {
  if (!src) {
    return null;
  }

  if (typeof src === "object") {
    return (
      <Image
        src={src as unknown as StaticImageData}
        alt={alt}
        sizes="(min-width: 48rem) 46rem, 100vw"
        className={props.className}
        title={props.title}
      />
    );
  }

  // Remote images keep intrinsic markup: `remarkImageOptions.external` is false
  // in source.config.ts, so their dimensions were never resolved at build time.
  return <img src={src} alt={alt} {...props} />;
}

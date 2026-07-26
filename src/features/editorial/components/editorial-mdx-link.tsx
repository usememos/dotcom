import Link from "next/link";
import type { ComponentProps } from "react";

function isInternal(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

/**
 * Link renderer for editorial MDX bodies.
 *
 * Internal hrefs route through `next/link` so in-article navigation stays a
 * client transition; external ones open in a new tab with `rel` hardening so a
 * linked page cannot reach back through `window.opener`.
 */
export function EditorialMdxLink({ href, children, ...props }: ComponentProps<"a">) {
  if (!href) {
    return <a {...props}>{children}</a>;
  }

  if (isInternal(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
      {children}
    </a>
  );
}

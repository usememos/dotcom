import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { SITE_NAV_ITEMS } from "@/lib/seo";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image src="/logo.png" alt="Memos" width={24} height={24} className="rounded" priority />
        Memos
      </>
    ),
  },
  links: SITE_NAV_ITEMS.map((item) => ({
    text: <span className="font-semibold">{item.name}</span>,
    url: item.href,
  })),
  githubUrl: "https://github.com/usememos/memos",
};

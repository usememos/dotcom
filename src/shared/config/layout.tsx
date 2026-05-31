import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { SITE_NAV_ITEMS } from "@/shared/lib/seo";

/**
 * Shared Fumadocs layout configuration.
 *
 * The homepage applies this through MarketingSiteLayout.
 * The docs area applies this through its own docs layout.
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

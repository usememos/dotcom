import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

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
        <img src="/logo.png" alt="Memos" width="24" height="24" className="rounded" />
        Memos
      </>
    ),
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
    },
    {
      text: "Blog",
      url: "/blog",
    },
    {
      text: "Changelog",
      url: "/changelog",
    },
    {
      text: "Live Demo",
      url: "https://demo.usememos.com/",
      external: true,
    },
  ],
  githubUrl: "https://github.com/usememos/memos",
};

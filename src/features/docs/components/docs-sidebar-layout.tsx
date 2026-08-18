"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpenIcon, CodeIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ApiVersionSelector } from "@/features/docs/components/api-version-selector";

/** Static, so the sidebar prop identity does not churn on every navigation. */
const DOCS_SIDEBAR_TABS = [
  {
    title: "Documentation",
    url: "/docs",
    icon: (
      <div className="w-full h-full flex justify-center items-center">
        <BookOpenIcon size={16} />
      </div>
    ),
  },
  {
    title: "API Reference",
    url: "/docs/api",
    icon: (
      <div className="w-full h-full flex justify-center items-center">
        <CodeIcon size={16} />
      </div>
    ),
  },
];

export function DocsSidebarLayout({
  children,
  baseOptions,
  tree,
  showVersionSelector = false,
}: {
  children: ReactNode;
  baseOptions: BaseLayoutProps;
  tree: PageTree.Root;
  showVersionSelector?: boolean;
}) {
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions}
      links={[]}
      sidebar={{ banner: showVersionSelector ? <ApiVersionSelector /> : undefined, tabs: DOCS_SIDEBAR_TABS }}
    >
      {children}
    </DocsLayout>
  );
}

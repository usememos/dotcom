"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpenIcon, CodeIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function ClientLayout({
  children,
  baseOptions,
  mainTree,
  apiTree,
}: {
  children: ReactNode;
  baseOptions: BaseLayoutProps;
  mainTree: PageTree.Root;
  apiTree: PageTree.Root;
}) {
  const pathname = usePathname();
  const isApi = pathname.startsWith("/docs/api");

  return (
    <DocsLayout
      tree={isApi ? apiTree : mainTree}
      {...baseOptions}
      links={[]}
      sidebar={{
        tabs: [
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
        ],
      }}
    >
      {children}
    </DocsLayout>
  );
}

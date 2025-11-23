"use client";

import type { PageTree } from "fumadocs-core/server";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookTextIcon, CodeIcon } from "lucide-react";
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
            title: "Docs",
            url: "/docs",
            icon: (
              <div className="w-full h-full flex justify-center items-center">
                <BookTextIcon size={16} />
              </div>
            ),
          },
          {
            title: "API References",
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

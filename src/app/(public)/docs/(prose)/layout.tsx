import type { ReactNode } from "react";
import { DocsSidebarLayout } from "@/features/docs/components/docs-sidebar-layout";
import { docsLayoutOptions } from "@/features/docs/lib/layout-options";
import { buildMainTree } from "@/features/docs/lib/page-tree";
import { source } from "@/shared/content/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsSidebarLayout baseOptions={docsLayoutOptions} tree={buildMainTree(source.pageTree)}>
      {children}
    </DocsSidebarLayout>
  );
}

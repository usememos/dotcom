import type { ReactNode } from "react";
import { DocsSidebarLayout } from "@/features/docs/components/docs-sidebar-layout";
import { docsLayoutOptions } from "@/features/docs/lib/layout-options";
import { buildApiTreeForVersion } from "@/features/docs/lib/page-tree";
import { source } from "@/shared/content/source";

/**
 * The version segment lets this layout narrow the sidebar tree on the server,
 * so a page only serializes its own version's entries instead of every
 * historical snapshot. Unknown versions never reach this layout: the page
 * below sets `dynamicParams = false` over version-validated static params.
 */
export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ version: string }> }) {
  const { version } = await params;

  return (
    <DocsSidebarLayout baseOptions={docsLayoutOptions} tree={buildApiTreeForVersion(source.pageTree, version)} showVersionSelector>
      {children}
    </DocsSidebarLayout>
  );
}

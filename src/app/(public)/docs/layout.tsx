import type * as PageTree from "fumadocs-core/page-tree";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { docsLayoutOptions } from "@/features/docs/lib/layout-options";
import { source } from "@/shared/content/source";
import "./docs.css";
import { ClientLayout } from "./layout.client";

// next-themes owns the theme in the root layout; Fumadocs only needs search.
const FUMADOCS_THEME = { enabled: false };
const FUMADOCS_SEARCH = { options: { type: "static" as const } };

export default function Layout({ children }: { children: ReactNode }) {
  const root = source.pageTree;

  const apiNode = root.children.find((node) => node.name === "API Reference" && node.type === "folder");

  const mainTree = {
    ...root,
    children: root.children.filter((node) => node.name !== "API Reference"),
  };

  const apiTree = {
    name: "API Reference",
    children: apiNode && "children" in apiNode ? (apiNode.children as PageTree.Node[]) : [],
  };

  // RootProvider sits above ClientLayout, which subscribes to usePathname():
  // nesting it inside would rebuild the search context on every docs navigation.
  return (
    <RootProvider theme={FUMADOCS_THEME} search={FUMADOCS_SEARCH}>
      <ClientLayout baseOptions={docsLayoutOptions} mainTree={mainTree} apiTree={apiTree}>
        {children}
      </ClientLayout>
    </RootProvider>
  );
}

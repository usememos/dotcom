import type { PageTree } from "fumadocs-core/server";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { ClientLayout } from "./layout.client";

export default function Layout({ children }: { children: ReactNode }) {
  const root = source.pageTree;

  const apiNode = root.children.find((node) => node.$id === "api" && node.type === "folder");

  const mainTree = {
    ...root,
    children: root.children.filter((node) => node.$id !== "api"),
  };

  const apiTree = {
    name: "API Reference",
    children: apiNode && "children" in apiNode ? (apiNode.children as PageTree.Node[]) : [],
  };

  return (
    <ClientLayout baseOptions={baseOptions} mainTree={mainTree} apiTree={apiTree}>
      {children}
    </ClientLayout>
  );
}

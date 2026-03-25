"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookOpenIcon, CodeIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ApiVersionSelector } from "@/components/api-version-selector";
import { getApiDocsVersionFromPathname, getApiDocsVersionLabel } from "@/lib/api-docs";

function isFolder(node: PageTree.Node): node is PageTree.Folder {
  return node.type === "folder";
}

function isPage(node: PageTree.Node): node is PageTree.Item {
  return node.type === "page";
}

function matchesVersionName(name: ReactNode, version: string): boolean {
  if (typeof name !== "string") {
    return false;
  }

  const normalizedName = name.trim().toLowerCase();
  const normalizedVersion = version.trim().toLowerCase();
  const normalizedLabel = getApiDocsVersionLabel(version).trim().toLowerCase();

  return normalizedName === normalizedVersion || normalizedName === normalizedLabel;
}

function folderContainsVersion(folder: PageTree.Folder, version: string): boolean {
  const versionPrefix = `/docs/api/${version}`;

  if (matchesVersionName(folder.name, version)) {
    return true;
  }

  if (folder.index?.url?.startsWith(versionPrefix)) {
    return true;
  }

  return folder.children.some((child) => {
    if (isPage(child)) {
      return child.url.startsWith(`${versionPrefix}/`) || child.url === versionPrefix;
    }

    if (isFolder(child)) {
      return folderContainsVersion(child, version);
    }

    return false;
  });
}

function getApiTreeForVersion(apiTree: PageTree.Root, version: string): PageTree.Root {
  const versionRoot = apiTree.children.find((node): node is PageTree.Folder => isFolder(node) && folderContainsVersion(node, version));

  if (!versionRoot) {
    return apiTree;
  }

  return {
    name: apiTree.name,
    children: versionRoot.index ? [versionRoot.index, ...versionRoot.children] : versionRoot.children,
  };
}

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
  const apiVersion = getApiDocsVersionFromPathname(pathname);
  const activeApiTree = getApiTreeForVersion(apiTree, apiVersion);

  return (
    <DocsLayout
      tree={isApi ? activeApiTree : mainTree}
      {...baseOptions}
      links={[]}
      sidebar={{
        banner: isApi ? <ApiVersionSelector /> : undefined,
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

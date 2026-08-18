import type * as PageTree from "fumadocs-core/page-tree";

function isFolder(node: PageTree.Node): node is PageTree.Folder {
  return node.type === "folder";
}

/**
 * API branch folders are identified by their loader-assigned `$id` (the
 * content dir path, e.g. "api" or "api/latest") rather than display names, so
 * retitling meta.json cannot silently change which branch gets filtered out
 * of the sidebar trees.
 */
const API_FOLDER_ID = "api";

function isApiFolder(node: PageTree.Node): node is PageTree.Folder {
  return isFolder(node) && node.$id === API_FOLDER_ID;
}

/* `source.pageTree` is a module singleton, so each distinct tree builds once
   per process instead of once per prerendered page. */
const mainTreeCache = new WeakMap<PageTree.Root, PageTree.Root>();
const apiTreeCache = new WeakMap<PageTree.Root, Map<string, PageTree.Root>>();

/** The docs tree without the API Reference branch. */
export function buildMainTree(root: PageTree.Root): PageTree.Root {
  const cached = mainTreeCache.get(root);
  if (cached) return cached;

  const tree: PageTree.Root = {
    ...root,
    children: root.children.filter((node) => !isApiFolder(node)),
  };
  mainTreeCache.set(root, tree);
  return tree;
}

/**
 * The API Reference tree narrowed to one version's subtree, so pages only
 * serialize the sidebar entries their version can actually show.
 */
export function buildApiTreeForVersion(root: PageTree.Root, version: string): PageTree.Root {
  let byVersion = apiTreeCache.get(root);
  if (!byVersion) {
    byVersion = new Map();
    apiTreeCache.set(root, byVersion);
  }
  const cached = byVersion.get(version);
  if (cached) return cached;

  const apiNode = root.children.find(isApiFolder);
  const versionId = `${API_FOLDER_ID}/${version}`;
  const versionRoot = apiNode?.children.find((node): node is PageTree.Folder => isFolder(node) && node.$id === versionId);

  if (!apiNode || !versionRoot) {
    // This runs during the static build: failing loudly beats silently
    // re-serializing every historical version into every API page.
    throw new Error(`No API docs subtree found for version "${version}" — the page tree and api-docs-versions.json disagree.`);
  }

  const tree: PageTree.Root = {
    name: apiNode.name,
    children: versionRoot.index ? [versionRoot.index, ...versionRoot.children] : versionRoot.children,
  };
  byVersion.set(version, tree);
  return tree;
}

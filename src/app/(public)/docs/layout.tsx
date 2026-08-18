import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import "./docs.css";

// next-themes owns the theme in the root layout; Fumadocs only needs search.
const FUMADOCS_THEME = { enabled: false };
const FUMADOCS_SEARCH = { options: { type: "static" as const } };

/**
 * Shared docs chrome stops here: the sidebar (and its serialized page tree)
 * lives in the (prose) and api/[version] child layouts, so each branch only
 * ships the tree it can actually show.
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={FUMADOCS_THEME} search={FUMADOCS_SEARCH}>
      {children}
    </RootProvider>
  );
}

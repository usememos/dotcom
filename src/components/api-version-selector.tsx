"use client";

import { SidebarTabsDropdown } from "fumadocs-ui/components/sidebar/tabs/dropdown";
import { usePathname } from "next/navigation";
import { apiDocsVersions, getApiDocsVersionPath, isApiDocsVersion } from "@/lib/api-docs";

export function ApiVersionSelector() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const suffix = segments[0] === "docs" && segments[1] === "api" ? segments.slice(isApiDocsVersion(segments[2]) ? 3 : 2) : [];
  const options = apiDocsVersions.map((version) => ({
    title: version.label,
    description: version.isLatest ? "Current main branch schema" : `Release ${version.label}`,
    url: getApiDocsVersionPath(version.slug, suffix),
  }));

  return <SidebarTabsDropdown options={options} placeholder="API Version" />;
}

import { createOpenAPI } from "fumadocs-openapi/server";
import { createAPIPage } from "fumadocs-openapi/ui";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { apiDocsVersions } from "@/features/docs/lib/api-docs";
import { Card, Cards } from "@/shared/ui/card";

const APIPage = createAPIPage(
  createOpenAPI({
    input: apiDocsVersions.map((version) => `./openapi/${version.slug}.yaml`),
  }),
);

// Custom MDX components for Memos documentation
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage,
    Card,
    Cards,
    ...components,
  };
}

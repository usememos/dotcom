import { createOpenAPI } from "fumadocs-openapi/server";
import { createAPIPage } from "fumadocs-openapi/ui";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Card, Cards } from "@/components/ui/card";
import { apiDocsVersions } from "@/lib/api-docs";

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

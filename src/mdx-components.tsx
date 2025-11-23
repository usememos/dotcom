import { createOpenAPI } from "fumadocs-openapi/server";
import { createAPIPage } from "fumadocs-openapi/ui";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/ui/callout";
import { Card, Cards } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

const APIPage = createAPIPage(
  createOpenAPI({
    input: ["./openapi.yaml"],
  }),
);

// Custom MDX components for Memos documentation
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage,
    Card,
    Cards,
    Callout,
    CodeBlock,
    ...components,
  };
}

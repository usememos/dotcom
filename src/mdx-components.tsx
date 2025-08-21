import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Card, Cards } from "@/components/ui/card";
import { Callout } from "@/components/ui/callout";
import { CodeBlock } from "@/components/ui/code-block";

// Custom MDX components for Memos documentation
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Card,
    Cards,
    Callout,
    CodeBlock,
    ...components,
  };
}

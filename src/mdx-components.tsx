import type { MDXComponents } from "mdx/types";
import { Card, Cards } from "@/shared/ui/card";
import { TypesetTable } from "@/shared/ui/typeset";

// Project-owned baseline for non-documentation MDX.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    Card,
    Cards,
    table: TypesetTable,
    ...components,
  };
}

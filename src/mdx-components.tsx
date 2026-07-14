import { createOpenAPI } from "fumadocs-openapi/server";
import { createAPIPage } from "fumadocs-openapi/ui";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { apiDocsVersions } from "@/features/docs/lib/api-docs";
import { Card, Cards } from "@/shared/ui/card";
import { TypesetTable } from "@/shared/ui/typeset";

const OpenAPIPage = createAPIPage(
  createOpenAPI({
    input: apiDocsVersions.map((version) => `./openapi/${version.slug}.yaml`),
  }),
);

function APIPage(props: ComponentProps<typeof OpenAPIPage>) {
  return (
    <div className="not-typeset">
      <OpenAPIPage {...props} />
    </div>
  );
}

// Custom MDX components for Memos documentation
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage,
    Card,
    Cards,
    table: TypesetTable,
    ...components,
  };
}

import { createOpenAPI } from "fumadocs-openapi/server";
import { createAPIPage } from "fumadocs-openapi/ui";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { apiDocsVersions } from "@/features/docs/lib/api-docs";
import { getMDXComponents } from "@/mdx-components";

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

export function getDocsMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...getMDXComponents(),
    APIPage,
    ...components,
  };
}

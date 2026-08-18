import type { GeneratedPageProps } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { OpenAPIPage } from "@/features/docs/components/openapi-page";
import { apiDocsVersions } from "@/features/docs/lib/api-docs";
import { pruneOpenAPIDocument } from "@/features/docs/lib/prune-openapi";
import { getMDXComponents } from "@/mdx-components";

const openapi = createOpenAPI({
  input: apiDocsVersions.map((version) => `./openapi/${version.slug}.yaml`),
});

async function APIPage({ document, ...props }: GeneratedPageProps) {
  const { bundled } = await openapi.getSchema(document);
  // OpenAPIPage is a client component, so the document lands in the page's RSC
  // payload — send only what this page's operations actually reference.
  const pruned = pruneOpenAPIDocument(bundled, props.operations, props.webhooks);

  return (
    <div className="not-typeset">
      <OpenAPIPage {...props} payload={{ bundled: pruned as typeof bundled }} />
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

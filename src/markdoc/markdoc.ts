import Markdoc from "@markdoc/markdoc";
import yaml from "js-yaml";
import heading from "./heading";

export function markdoc<F>(content: string) {
  const config = {
    tags: {},
    nodes: {
      heading,
    },
    variables: {},
  };

  const markDocAst = Markdoc.parse(content);
  const frontmatter = (markDocAst.attributes.frontmatter ? yaml.load(markDocAst.attributes.frontmatter) : {}) as F;
  const transformedContent = Markdoc.transform(markDocAst, config);

  return {
    frontmatter,
    transformedContent,
  };
}

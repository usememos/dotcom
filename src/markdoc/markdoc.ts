import Markdoc from "@markdoc/markdoc";
import yaml from "js-yaml";
import { Frontmatter } from "@/types/content";
import heading from "./heading";

export const markdoc = (content: string) => {
  const config = {
    tags: {},
    nodes: {
      heading,
    },
    variables: {},
  };

  const markDocAst = Markdoc.parse(content);
  const frontmatter = (markDocAst.attributes.frontmatter ? yaml.load(markDocAst.attributes.frontmatter) : {}) as Frontmatter;
  const transformedContent = Markdoc.transform(markDocAst, config);

  return {
    frontmatter,
    transformedContent,
  };
};

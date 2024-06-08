import Markdoc from "@markdoc/markdoc";
import type { Config } from "@markdoc/markdoc";
import yaml from "js-yaml";
import type { Frontmatter } from "@/types/content";
import admonition from "./admonition";
import heading from "./heading";

export const markdoc = (content: string) => {
  const config: Config = {
    tags: {
      admonition: admonition,
    },
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

import Markdoc, { type Config } from "@markdoc/markdoc";
import yaml from "js-yaml";
import { Admonition } from "@/components/Admonition";
import { Heading } from "@/components/Heading";
import type { Frontmatter } from "@/types/content";
import admonitionSchema from "./admonition";
import headingSchema from "./heading";

export const components = {
  Admonition: Admonition,
  Heading: Heading,
};

export const markdoc = (content: string) => {
  const config: Config = {
    tags: {
      admonition: admonitionSchema,
    },
    nodes: {
      heading: headingSchema,
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

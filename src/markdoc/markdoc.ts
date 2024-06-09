import Markdoc, { type Config } from "@markdoc/markdoc";
import yaml from "js-yaml";
import { Admonition } from "@/components/Admonition";
import { CodeBlock } from "@/components/CodeBlock";
import { Heading } from "@/components/Heading";
import type { Frontmatter } from "@/types/content";
import admonitionSchema from "./admonition";
import codeBlockSchema from "./codeBlock";
import headingSchema from "./heading";

export const components = {
  Admonition: Admonition,
  Heading: Heading,
  CodeBlock: CodeBlock,
};

export const markdoc = (content: string) => {
  const config: Config = {
    tags: {
      admonition: admonitionSchema,
    },
    nodes: {
      heading: headingSchema,
      fence: codeBlockSchema,
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

import type { MDXComponents } from "mdx/types";
import { EditorialCodeBlock } from "@/features/editorial/components/editorial-code-block";
import { EditorialMdxImage } from "@/features/editorial/components/editorial-mdx-image";
import { EditorialMdxLink } from "@/features/editorial/components/editorial-mdx-link";
import { getMDXComponents } from "@/mdx-components";

/**
 * MDX registry for blog and changelog bodies.
 *
 * The docs registry gets these primitives from `defaultMdxComponents`; editorial
 * routes deliberately stay off Fumadocs UI, so they are project-owned here.
 */
export const editorialMdxComponents: MDXComponents = getMDXComponents({
  a: EditorialMdxLink,
  img: EditorialMdxImage,
  pre: EditorialCodeBlock,
});

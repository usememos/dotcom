import clsx from "clsx";
import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { useMDXComponents } from "@/lib/mdx-components";
import "@/styles/typography.css";

interface Props {
  content?: string;
  children?: React.ReactNode;
  className?: string;
}

const MdxRenderer = ({ content, children, className }: Props) => {
  const components = useMDXComponents();

  return (
    <div className={clsx("prose prose-gray max-w-none prose-lg", className)}>
      {content ? (
        <MDXRemote
          source={content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm, remarkFrontmatter],
              rehypePlugins: [],
            },
          }}
          components={components}
        />
      ) : (
        children
      )}
    </div>
  );
};

export default MdxRenderer;

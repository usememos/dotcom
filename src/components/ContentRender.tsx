import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";
import clsx from "clsx";
import "github-markdown-css/github-markdown-light.css";
import React from "react";
import { components } from "@/markdoc/markdoc";
import "@/styles/typography.css";

interface Props {
  markdocNode: RenderableTreeNode;
  className?: string;
}

const ContentRender = ({ markdocNode, className }: Props) => {
  return (
    <div
      className={clsx(
        "content w-full max-w-full prose prose-base sm:prose-lg lg:prose-xl prose-img:rounded-xl prose-a:text-teal-600 prose-code:break-all",
        className,
      )}
    >
      {Markdoc.renderers.react(markdocNode, React, { components })}
    </div>
  );
};

export default ContentRender;

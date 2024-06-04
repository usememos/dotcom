import Markdoc, { RenderableTreeNode } from "@markdoc/markdoc";
import classNames from "classnames";
import "github-markdown-css/github-markdown-light.css";
import React from "react";
import "@/styles/typography.css";

interface Props {
  markdocNode: RenderableTreeNode;
  className?: string;
}

const ContentRender = ({ markdocNode, className }: Props) => {
  return (
    <div
      className={classNames(
        "content w-full max-w-full prose prose-base sm:prose-lg lg:prose-xl prose-img:rounded-xl prose-a:text-blue-600 prose-code:break-all",
        className,
      )}
    >
      {Markdoc.renderers.react(markdocNode, React)}
    </div>
  );
};

export default ContentRender;

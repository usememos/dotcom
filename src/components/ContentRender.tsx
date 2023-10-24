import Markdoc, { RenderableTreeNode } from "@markdoc/markdoc";
import classNames from "classnames";
import React from "react";

interface Props {
  markdocNode: RenderableTreeNode;
  className?: string;
}

const ContentRender = ({ markdocNode, className }: Props) => {
  return (
    <div
      className={classNames(
        "w-full max-w-4xl prose prose-base sm:prose-lg lg:prose-xl prose-img:rounded-xl prose-a:text-blue-600",
        className,
      )}
    >
      {Markdoc.renderers.react(markdocNode, React)}
    </div>
  );
};

export default ContentRender;

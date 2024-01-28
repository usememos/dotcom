"use client";

import Markdoc, { Tag } from "@markdoc/markdoc";
import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "@/styles/typography.css";

interface Props {
  headings: Tag[];
}

const TableOfContent = ({ headings }: Props) => {
  const titles = useRef<HTMLElement[]>([]);
  const [currentAnchor, setCurrentAnchor] = useState<string | null>(null);

  useEffect(() => {
    titles.current = headings
      .map((heading) => document.getElementById(heading.attributes.id))
      .filter((anchor): anchor is HTMLElement => anchor !== null);

    updateCurrentAnchor();

    window.addEventListener("scroll", updateCurrentAnchor);
    return () => window.removeEventListener("scroll", updateCurrentAnchor);
  });

  const updateCurrentAnchor = useCallback(() => {
    const currentTitleIndex = titles.current.findIndex((anchor) => anchor.getBoundingClientRect().top - 40 >= 0);
    if (currentTitleIndex !== -1) {
      const currentTitle = titles.current[currentTitleIndex];
      setCurrentAnchor(currentTitle.id);
    }
  }, []);

  return (
    <div className="w-full flex flex-col justify-start items-start">
      <p className="font-medium text-sm pl-2 pb-3">ON THIS PAGE</p>
      <ul className="w-full flex flex-col justify-start items-start">
        {headings.map((heading) => {
          const id = heading.attributes.id;
          return (
            <li
              key={id}
              className={classNames("w-full border-l-2 pl-2 py-1", currentAnchor === id ? "border-gray-600" : "border-gray-200")}
            >
              <a
                href={`#${id}`}
                className={classNames("text-sm text-gray-600 hover:opacity-80", {
                  "font-medium": currentAnchor === id,
                })}
              >
                {Markdoc.renderers.react(heading.children, React)}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableOfContent;

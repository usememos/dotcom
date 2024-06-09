"use client";

import copy from "copy-to-clipboard";
import "github-markdown-css/github-markdown-light.css";
import prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism.min.css";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

interface Props {
  children: React.ReactNode;
  language: string;
}

export function CodeBlock({ children, language }: Props) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) {
      prism.highlightElement(ref.current, false);
    }
  });

  useEffect(() => {
    if (copied && ref.current) {
      copy(ref.current.innerText);
      const to = setTimeout(setCopied, 1500, false);
      return () => clearTimeout(to);
    }
  }, [copied]);

  return (
    <>
      <div className={"border-[.1vh] m-2 hover:border-zinc-300 rounded-lg relative"}>
        <pre ref={ref} className={`language-${language} !font-mono !tracking-tight !leading-tight !bg-transparent`}>
          {children}
        </pre>
        <button
          type="button"
          onClick={() => setCopied(true)}
          className={
            "top-4 rounded-lg absolute right-3 p-1.5 hover:bg-zinc-200 hover:text-zinc-500 text-zinc-400 transition-colors duration-300"
          }
        >
          {copied ? <Icon.Check /> : <Icon.Copy />}
        </button>
      </div>
    </>
  );
}

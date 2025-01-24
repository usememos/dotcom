"use client";

import copy from "copy-to-clipboard";
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

const CodeBlock = ({ children, language }: Props) => {
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
      <div className={"relative"}>
        <pre
          ref={ref}
          className={`language-${language} border-[.1vh] hover:border-zinc-300 rounded-lg font-mono! tracking-tight! leading-tight! bg-transparent!`}
        >
          {children}
        </pre>
        <button
          type="button"
          onClick={() => setCopied(true)}
          className={
            "rounded-lg absolute top-1 right-1 p-1 backdrop-blur-sm bg-white bg-opacity-60 hover:bg-zinc-200 hover:text-zinc-500 text-zinc-400 transition-colors duration-300"
          }
        >
          {copied ? <Icon.Check className="w-4 h-4" /> : <Icon.Copy className="w-4 h-4" />}
        </button>
      </div>
    </>
  );
};

export default CodeBlock;

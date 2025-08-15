import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import React from "react";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const components: MDXComponents = {
  // Headings with proper styling and id generation
  h1: ({ children }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, "-");
    return (
      <h1 id={id} className="text-4xl font-bold text-gray-900 mt-8 mb-6 first:mt-0">
        {children}
      </h1>
    );
  },
  h2: ({ children }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, "-");
    return (
      <h2 id={id} className="text-3xl font-semibold text-gray-900 mt-8 mb-4">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, "-");
    return (
      <h3 id={id} className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
        {children}
      </h3>
    );
  },
  h4: ({ children }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, "-");
    return (
      <h4 id={id} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        {children}
      </h4>
    );
  },
  h5: ({ children }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, "-");
    return (
      <h5 id={id} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
        {children}
      </h5>
    );
  },
  h6: ({ children }) => {
    const id = String(children).toLowerCase().replace(/\s+/g, "-");
    return (
      <h6 id={id} className="text-base font-semibold text-gray-900 mt-4 mb-2">
        {children}
      </h6>
    );
  },

  // Paragraphs
  p: ({ children }) => <p className="text-gray-700 leading-relaxed my-4">{children}</p>,

  // Custom image component with Next.js optimization
  img: (props) => {
    const { alt = "", src, ...rest } = props as ImageProps;
    if (!src) return null;
    return (
      <Image sizes="100vw" style={{ width: "100%", height: "auto" }} alt={alt} src={src} className="rounded-xl shadow-lg my-6" {...rest} />
    );
  },

  // Custom link component
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("http")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:text-teal-700 no-underline hover:underline"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href || "#"} className="text-teal-600 hover:text-teal-700 no-underline hover:underline" {...props}>
        {children}
      </Link>
    );
  },

  // Lists
  ul: ({ children }) => <ul className="list-disc list-inside my-4 space-y-2 text-gray-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside my-4 space-y-2 text-gray-700">{children}</ol>,
  li: ({ children }) => <li className="text-gray-700">{children}</li>,

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-teal-500 bg-gray-50 pl-6 py-4 my-6 italic text-gray-700">{children}</blockquote>
  ),

  // Tables
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  th: ({ children }) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">{children}</th>,
  td: ({ children }) => <td className="border border-gray-300 px-4 py-2 text-gray-700">{children}</td>,

  // Strong and emphasis
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,

  // Horizontal rule
  hr: () => <hr className="border-t border-gray-300 my-8" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}

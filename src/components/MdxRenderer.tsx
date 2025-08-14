import clsx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@/styles/typography.css";

interface Props {
  content?: string;
  children?: React.ReactNode;
  className?: string;
}

const MdxRenderer = ({ content, children, className }: Props) => {
  return (
    <div
      className={clsx(
        "prose prose-gray max-w-none prose-lg",
        // Headings - match MDX components sizing
        "prose-headings:text-gray-900 prose-headings:font-semibold",
        "prose-h1:text-4xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-6 prose-h1:first:mt-0",
        "prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4",
        "prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3",
        "prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3",
        "prose-h5:text-lg prose-h5:mt-4 prose-h5:mb-2",
        "prose-h6:text-base prose-h6:mt-4 prose-h6:mb-2",
        // Text and links - improved readability
        "prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-4 prose-p:text-base",
        "prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-teal-700",
        "prose-strong:text-gray-900 prose-strong:font-semibold",
        "prose-em:text-gray-700 prose-em:italic",
        // Lists - better spacing
        "prose-ul:my-4 prose-ul:space-y-2 prose-ul:list-disc",
        "prose-ol:my-4 prose-ol:space-y-2 prose-ol:list-decimal",
        "prose-li:text-gray-700",
        // Images - consistent styling
        "prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6 prose-img:w-full prose-img:h-auto",
        // Blockquotes - unified styling
        "prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-700",
        // Tables - improved styling
        "prose-table:my-6 prose-table:border-collapse prose-table:min-w-full",
        "prose-thead:bg-gray-50",
        "prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:font-semibold prose-th:text-gray-900 prose-th:text-left",
        "prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-td:text-gray-700",
        // Horizontal rule
        "prose-hr:border-gray-300 prose-hr:my-8 prose-hr:border-t",
        className,
      )}
    >
      {content ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Heading components with proper id generation
            h1: ({ children }) => <h1 id={String(children).toLowerCase().replace(/\s+/g, "-")}>{children}</h1>,
            h2: ({ children }) => <h2 id={String(children).toLowerCase().replace(/\s+/g, "-")}>{children}</h2>,
            h3: ({ children }) => <h3 id={String(children).toLowerCase().replace(/\s+/g, "-")}>{children}</h3>,
            h4: ({ children }) => <h4 id={String(children).toLowerCase().replace(/\s+/g, "-")}>{children}</h4>,
            h5: ({ children }) => <h5 id={String(children).toLowerCase().replace(/\s+/g, "-")}>{children}</h5>,
            h6: ({ children }) => <h6 id={String(children).toLowerCase().replace(/\s+/g, "-")}>{children}</h6>,
          }}
        >
          {content}
        </ReactMarkdown>
      ) : (
        children
      )}
    </div>
  );
};

export default MdxRenderer;

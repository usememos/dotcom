import { ReactNode } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  children: ReactNode;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ children, language, title, showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (typeof children === 'string') {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative bg-gray-900 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm my-6 overflow-hidden">
      {/* Header */}
      {(title || language) && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {title && (
              <span className="text-sm font-semibold text-gray-200">
                {title}
              </span>
            )}
            {language && (
              <span className="text-xs text-gray-400 bg-gray-700 dark:bg-gray-800 px-2 py-1 rounded-full">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={copyCode}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-700 dark:hover:bg-gray-800 rounded-lg"
            title="Copy code"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-400" />
            ) : (
              <CopyIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      )}
      
      {/* Code Content */}
      <div className="relative">
        <pre className={`p-6 text-sm leading-relaxed overflow-x-auto ${showLineNumbers ? 'pl-12' : ''}`}>
          <code className="text-gray-100">
            {children}
          </code>
        </pre>
        
        {/* Copy button when no header */}
        {!title && !language && (
          <button
            onClick={copyCode}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-800 dark:hover:bg-gray-700 rounded-lg"
            title="Copy code"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-green-400" />
            ) : (
              <CopyIcon className="w-4 h-4 text-gray-400 hover:text-gray-200" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
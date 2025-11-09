"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon, TerminalIcon } from "lucide-react";

export function DockerCommand() {
  const [copied, setCopied] = useState(false);
  const dockerCommand = `docker run -d --name memos \\
  -p 5230:5230 \\
  -v ~/.memos/:/var/opt/memos \\
  neosmemo/memos:stable`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(dockerCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl overflow-hidden hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-xl transition-all duration-300">
      <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-600 dark:text-teal-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
            <TerminalIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Docker</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">One command to start your Memos instance</p>
      </div>
      <div className="relative bg-gray-900 dark:bg-black p-6 sm:p-8">
        <pre className="text-sm sm:text-base text-gray-100 overflow-x-auto">
          <code>{dockerCommand}</code>
        </pre>
        <button
          onClick={copyToClipboard}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 opacity-0 group-hover:opacity-100"
          title={copied ? "Copied!" : "Copy to clipboard"}
          aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
        >
          {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4 text-gray-400 hover:text-gray-200" />}
        </button>
      </div>
    </div>
  );
}

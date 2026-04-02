"use client";

import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";
import { useState } from "react";

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
    <div className="group overflow-hidden rounded-[1.75rem] border border-stone-300/60 bg-[rgba(255,252,247,0.74)] transition-colors duration-300 dark:border-white/10 dark:bg-[#171310]">
      <div className="flex items-start justify-between gap-4 border-b border-stone-300/65 px-6 py-6 dark:border-white/10 sm:px-8 sm:py-7">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center text-stone-700 transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-stone-200 sm:h-11 sm:w-11">
              <TerminalIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-xl">Docker</h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-600 dark:text-stone-400 sm:text-base">
            One command to start your Memos server
          </p>
        </div>
      </div>
      <div className="relative bg-stone-950 px-6 py-6 dark:bg-[#120f0d] sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-stone-400/60 to-transparent" />
        <pre className="overflow-x-auto pr-14 text-sm leading-7 text-slate-100 sm:text-base">
          <code>{dockerCommand}</code>
        </pre>
        <button
          type="button"
          onClick={copyToClipboard}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2.5 text-stone-300 opacity-100 backdrop-blur transition-colors duration-200 hover:bg-white/10 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
          title={copied ? "Copied!" : "Copy to clipboard"}
          aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
        >
          {copied ? <CheckIcon className="h-4 w-4 text-amber-300" /> : <CopyIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

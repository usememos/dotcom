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
    <div className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 dark:border-white/10 dark:bg-[#0b1114] dark:shadow-[0_24px_80px_-40px_rgba(0,0,0,0.6)] dark:hover:border-teal-500/40">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-6 py-6 dark:border-white/10 sm:px-8 sm:py-7">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 text-teal-700 transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-teal-300 sm:h-11 sm:w-11">
              <TerminalIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white sm:text-xl">Docker</h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            One command to start your Memos server
          </p>
        </div>
      </div>
      <div className="relative bg-slate-950 px-6 py-6 dark:bg-black sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/70 to-transparent" />
        <pre className="overflow-x-auto pr-14 text-sm leading-7 text-slate-100 sm:text-base">
          <code>{dockerCommand}</code>
        </pre>
        <button
          type="button"
          onClick={copyToClipboard}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 p-2.5 text-slate-300 opacity-100 backdrop-blur transition-colors duration-200 hover:bg-white/10 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
          title={copied ? "Copied!" : "Copy to clipboard"}
          aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
        >
          {copied ? <CheckIcon className="h-4 w-4 text-emerald-400" /> : <CopyIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

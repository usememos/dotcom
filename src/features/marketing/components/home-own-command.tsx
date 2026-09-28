"use client";

import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";
import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";

/** Each line carries a `data-anchor` so the Own chapter's notes can point at it. */
const COMMAND_LINES = [
  { anchor: "run", text: "docker run -d --name memos \\" },
  { anchor: "port", text: "  -p 5230:5230 \\" },
  { anchor: "data", text: "  -v ~/.memos/:/var/opt/memos \\" },
  { anchor: "image", text: "  neosmemo/memos:stable" },
] as const;

export const DOCKER_COMMAND = COMMAND_LINES.map((line) => line.text).join("\n");

export function HomeOwnCommand() {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div
      data-anatomy-card
      className="overflow-hidden rounded-xl border border-white/12 bg-white/6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <TerminalIcon aria-hidden="true" className="size-4 text-brand-300" />
          Docker
        </span>
        <button
          type="button"
          onClick={() => copy(DOCKER_COMMAND)}
          aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
        >
          {copied ? <CheckIcon aria-hidden="true" className="size-4 text-brand-300" /> : <CopyIcon aria-hidden="true" className="size-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-5 font-mono text-sm leading-7 text-zinc-100 sm:text-[0.9375rem]">
        <code translate="no">
          {COMMAND_LINES.map((line) => (
            <span key={line.anchor} data-anchor={line.anchor} className="block">
              {line.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

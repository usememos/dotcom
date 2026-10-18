"use client";

import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";
import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";
import { cn } from "@/shared/lib/utils";

/** Keep the displayed command and copied text in sync. */
const COMMAND_LINES = [
  { anchor: "run", text: "docker run -d --name memos \\" },
  { anchor: "port", text: "  -p 5230:5230 \\" },
  { anchor: "data", text: "  -v ~/.memos/:/var/opt/memos \\" },
  { anchor: "image", text: "  neosmemo/memos:stable" },
] as const;

export const DOCKER_COMMAND = COMMAND_LINES.map((line) => line.text).join("\n");

export function HomeOwnCommand({ prominent = false }: { prominent?: boolean }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-zinc-900">
      <div className={cn("flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3", prominent && "sm:px-8 sm:py-4")}>
        <span className={cn("flex items-center gap-2 font-medium text-zinc-300", prominent ? "text-base" : "text-sm")}>
          <TerminalIcon aria-hidden="true" className="size-4 text-brand-300" />
          Docker
        </span>
        <button
          type="button"
          onClick={() => copy(DOCKER_COMMAND)}
          aria-label={copied ? "Copied to clipboard" : "Copy command to clipboard"}
          className="inline-flex min-h-9 min-w-28 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
        >
          {copied ? <CheckIcon aria-hidden="true" className="size-4 text-brand-300" /> : <CopyIcon aria-hidden="true" className="size-4" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto px-5 font-mono text-zinc-100",
          prominent
            ? "py-6 text-base leading-8 sm:px-8 sm:py-8 sm:text-lg sm:leading-9 lg:text-xl lg:leading-10"
            : "py-5 text-sm leading-7 sm:text-[0.9375rem]",
        )}
      >
        <code translate="no">
          {COMMAND_LINES.map((line) => (
            <span key={line.anchor} className="block">
              {line.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

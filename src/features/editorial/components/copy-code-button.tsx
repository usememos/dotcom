"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useRef } from "react";
import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";
import { Button } from "@/shared/ui/button";

/**
 * Copy control for an editorial code block.
 *
 * Reads the rendered text from the sibling `<pre>` rather than from props: the
 * MDX children are highlighted spans, so the source text only exists in the DOM.
 */
export function CopyCodeButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { copied, copy } = useCopyToClipboard();

  return (
    <Button
      ref={buttonRef}
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={copied ? "Copied" : "Copy code"}
      className="absolute end-2 top-2 text-muted-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover/code:opacity-100"
      onClick={() => copy(buttonRef.current?.closest("figure")?.querySelector("pre")?.textContent ?? "")}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}

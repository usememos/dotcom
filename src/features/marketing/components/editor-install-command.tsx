"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import styles from "@/features/marketing/components/editor-showcase.module.css";
import { EDITOR_INSTALL_COMMAND } from "@/features/marketing/data/editor";
import { useCopyToClipboard } from "@/shared/lib/use-copy-to-clipboard";

/** The install command on ink, with a copy control that says what it did. */
export function EditorInstallCommand() {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={styles.install}>
      <pre className={`${styles.installCode} min-w-0 flex-1 overflow-x-auto`}>
        <code translate="no">{EDITOR_INSTALL_COMMAND}</code>
      </pre>
      <button
        type="button"
        onClick={() => copy(EDITOR_INSTALL_COMMAND)}
        aria-label={copied ? "Copied to clipboard" : "Copy install command to clipboard"}
        className={`${styles.installButton} shrink-0`}
      >
        {copied ? <CheckIcon aria-hidden="true" className="size-4" /> : <CopyIcon aria-hidden="true" className="size-4" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

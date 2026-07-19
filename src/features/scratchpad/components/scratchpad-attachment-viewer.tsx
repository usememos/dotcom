"use client";

import { AlertCircleIcon, DownloadIcon, FileIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/shared/ui/button";
import { type AttachmentPreviewMode, formatAttachmentSize, getAttachmentPreviewMode } from "../lib/attachment-preview";
import { getFile } from "../lib/indexeddb";
import type { FileData, ScratchpadAttachmentRef } from "../types";

interface ScratchpadAttachmentViewerProps {
  attachment: ScratchpadAttachmentRef | null;
  onClose: () => void;
}

interface ViewerState {
  fileData: FileData | null;
  objectUrl: string | null;
  textContent: string | null;
  mode: AttachmentPreviewMode | null;
  status: "idle" | "loading" | "ready" | "error";
}

const INITIAL_VIEWER_STATE: ViewerState = {
  fileData: null,
  objectUrl: null,
  textContent: null,
  mode: null,
  status: "idle",
};

function downloadAttachment(fileName: string, objectUrl: string) {
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();
}

function getDisplayType(fileData: FileData | null, attachment: ScratchpadAttachmentRef): string {
  return fileData?.type || attachment.type || "application/octet-stream";
}

export function ScratchpadAttachmentViewer({ attachment, onClose }: ScratchpadAttachmentViewerProps) {
  const titleId = useId();
  const [state, setState] = useState<ViewerState>(INITIAL_VIEWER_STATE);

  useEffect(() => {
    if (!attachment) {
      setState(INITIAL_VIEWER_STATE);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const loadAttachment = async () => {
      setState({ ...INITIAL_VIEWER_STATE, status: "loading" });

      try {
        const fileData = await getFile(attachment.id);
        if (cancelled) return;

        if (!fileData) {
          setState({ ...INITIAL_VIEWER_STATE, status: "error" });
          return;
        }

        const mode = getAttachmentPreviewMode(fileData.type, fileData.name);
        objectUrl = URL.createObjectURL(fileData.blob);
        const textContent = mode === "text" ? await fileData.blob.text() : null;

        if (!cancelled) {
          setState({
            fileData,
            objectUrl,
            textContent,
            mode,
            status: "ready",
          });
        }
      } catch {
        if (!cancelled) {
          setState({ ...INITIAL_VIEWER_STATE, status: "error" });
        }
      }
    };

    void loadAttachment();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [attachment]);

  useEffect(() => {
    if (!attachment) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [attachment, onClose]);

  if (!attachment) {
    return null;
  }

  const fileData = state.fileData;
  const fileName = fileData?.name ?? attachment.name;
  const fileType = getDisplayType(fileData, attachment);
  const fileSize = formatAttachmentSize(fileData?.size ?? attachment.size);
  const canDownload = Boolean(state.objectUrl);

  return (
    <div
      data-scratchpad-ui="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-2 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[calc(100svh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-md border border-stone-200/80 bg-white shadow-[0_18px_60px_rgba(28,25,23,0.18)] dark:border-white/10 dark:bg-stone-950 sm:max-h-[min(860px,calc(100svh-2rem))]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-10 shrink-0 items-center gap-1.5 border-b border-stone-200/80 px-2.5 dark:border-white/10 sm:gap-2 sm:px-3">
          <div className="min-w-0 flex-1 truncate text-[13px] leading-none">
            <h2 id={titleId} className="inline truncate font-medium text-stone-950 dark:text-stone-100">
              {fileName}
            </h2>
            <span className="ml-2 hidden text-[11px] text-stone-500 dark:text-stone-400 sm:inline">
              {fileType} / {fileSize}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!canDownload}
            onClick={() => {
              if (state.objectUrl) {
                downloadAttachment(fileName, state.objectUrl);
              }
            }}
            className="rounded-[5px] text-stone-500 hover:bg-stone-100 hover:text-stone-950 disabled:opacity-40 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
            title="Download"
            aria-label="Download attachment"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="rounded-[5px] text-stone-500 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
            title="Close"
            aria-label="Close attachment preview"
          >
            <XIcon className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="flex min-h-[240px] flex-1 items-center justify-center overflow-auto bg-stone-50 p-2 dark:bg-stone-900/70 sm:p-3">
          {state.status === "loading" && (
            <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
              <LoaderCircleIcon className="h-4 w-4 animate-spin" />
              Loading preview
            </div>
          )}

          {state.status === "error" && (
            <div className="flex max-w-sm flex-col items-center text-center text-sm text-stone-500 dark:text-stone-400">
              <AlertCircleIcon className="mb-3 h-7 w-7" />
              This attachment is no longer available in local storage.
            </div>
          )}

          {state.status === "ready" && renderPreview(state.mode, state.objectUrl, state.textContent, fileName, fileType, fileSize)}
        </div>
      </div>
    </div>
  );
}

function renderPreview(
  mode: AttachmentPreviewMode | null,
  objectUrl: string | null,
  textContent: string | null,
  fileName: string,
  fileType: string,
  fileSize: string,
) {
  if (!objectUrl || !mode) return null;

  if (mode === "image") {
    return <img src={objectUrl} alt={fileName} className="max-h-[calc(100svh-4.5rem)] max-w-full object-contain sm:max-h-[76vh]" />;
  }

  if (mode === "pdf") {
    return (
      <iframe
        src={objectUrl}
        title={fileName}
        className="h-[calc(100svh-4.5rem)] min-h-[240px] w-full rounded-[5px] border border-stone-200 bg-white dark:border-white/10 sm:h-[76vh]"
      />
    );
  }

  if (mode === "video") {
    // biome-ignore lint/a11y/useMediaCaption: Scratchpad previews arbitrary local uploads and cannot provide generated captions.
    return <video src={objectUrl} controls className="max-h-[calc(100svh-4.5rem)] max-w-full rounded-[5px] bg-black sm:max-h-[76vh]" />;
  }

  if (mode === "audio") {
    return (
      <div className="w-full max-w-xl rounded-[5px] border border-stone-200 bg-white p-3 dark:border-white/10 dark:bg-stone-950 sm:p-4">
        {/* biome-ignore lint/a11y/useMediaCaption: Scratchpad previews arbitrary local uploads and cannot provide generated captions. */}
        <audio src={objectUrl} controls className="w-full" />
      </div>
    );
  }

  if (mode === "text") {
    return (
      <pre className="h-[calc(100svh-4.5rem)] min-h-[240px] w-full overflow-auto rounded-[5px] border border-stone-200 bg-white p-3 text-left font-mono text-xs leading-5 text-stone-800 dark:border-white/10 dark:bg-stone-950 dark:text-stone-200 sm:h-[76vh] sm:p-4">
        {textContent}
      </pre>
    );
  }

  return (
    <div className="flex max-w-sm flex-col items-center text-center text-sm text-stone-500 dark:text-stone-400">
      <FileIcon className="mb-3 h-8 w-8" />
      <div className="font-medium text-stone-900 dark:text-stone-100">{fileName}</div>
      <div className="mt-1">
        {fileType} / {fileSize}
      </div>
      <div className="mt-3">Preview is not available for this file type. Use download to open it locally.</div>
    </div>
  );
}

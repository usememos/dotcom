"use client";

import { motion } from "framer-motion";
import { FileIcon, LoaderIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFile } from "@/lib/scratch/indexeddb";
import type { FileData, ScratchpadItem } from "@/lib/scratch/types";

interface CardItemProps {
  item: ScratchpadItem;
  onUpdateBody: (id: string, body: string) => void;
  onUpdateLayout: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
  onDragComplete?: () => void;
}

interface AttachmentPreview {
  id: string;
  fileData: FileData | null;
  previewUrl: string | null;
}

function getCardRingClass(item: ScratchpadItem, isSelected?: boolean): string {
  if (isSelected) {
    return "ring-2 ring-blue-500 dark:ring-blue-400 shadow-md";
  }

  if (item.sync.status === "error") {
    return "ring-2 ring-red-500 dark:ring-red-400 shadow-md";
  }

  if (item.sync.status === "saving") {
    return "ring-2 ring-amber-500 dark:ring-amber-400 shadow-md";
  }

  if (item.sync.status === "synced") {
    return "ring-2 ring-green-500 dark:ring-green-500 shadow-md";
  }

  return "";
}

export function CardItem({
  item,
  onUpdateBody,
  onUpdateLayout,
  onDelete,
  onRemoveAttachment,
  isSelected,
  onSelect,
  onDragComplete,
}: CardItemProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MIN_WIDTH = 220;
  const MIN_HEIGHT = 170;

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [item.body]);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    const loadAttachments = async () => {
      const previews = await Promise.all(
        item.attachments.map(async (attachment) => {
          const fileData = await getFile(attachment.id);
          if (!fileData) {
            return {
              id: attachment.id,
              fileData: null,
              previewUrl: null,
            };
          }

          if (fileData.type.startsWith("image/")) {
            const url = URL.createObjectURL(fileData.blob);
            urls.push(url);
            return {
              id: attachment.id,
              fileData,
              previewUrl: url,
            };
          }

          return {
            id: attachment.id,
            fileData,
            previewUrl: null,
          };
        }),
      );

      if (!cancelled) {
        setAttachmentPreviews(previews);
      }
    };

    void loadAttachments();

    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [item.attachments]);

  const previewMap = useMemo(() => new Map(attachmentPreviews.map((preview) => [preview.id, preview])), [attachmentPreviews]);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e.ctrlKey || e.metaKey);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Backspace" || e.key === "Delete") && item.body === "" && item.attachments.length === 0) {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  const handleTextareaMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateBody(item.id, e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: item.width,
      height: item.height,
    });
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;

      const newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
      const newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);

      onUpdateLayout(item.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      onDragComplete?.();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, item.id, onDragComplete, onUpdateLayout, resizeStart]);

  return (
    <motion.div
      data-scratchpad-item="true"
      data-scratchpad-item-id={item.id}
      drag={!isResizing}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      onDrag={(_, info) => {
        onUpdateLayout(item.id, {
          x: item.x + info.delta.x,
          y: item.y + info.delta.y,
        });
      }}
      onDragEnd={() => {
        onDragComplete?.();
      }}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`absolute flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow focus:outline-none cursor-move ${getCardRingClass(item, isSelected)}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        minHeight: item.height,
        zIndex: item.zIndex || 1,
        x: 0,
        y: 0,
      }}
      whileDrag={{ opacity: 0.5, cursor: "grabbing" }}
      title={item.sync.status === "synced" ? "Saved to Memos" : "Select and click save to save to Memos"}
    >
      {item.attachments.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3">
          <div className="grid grid-cols-2 gap-2">
            {item.attachments.map((attachment) => {
              const preview = previewMap.get(attachment.id);
              const isImage = attachment.type.startsWith("image/");

              return (
                <div
                  key={attachment.id}
                  className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void onRemoveAttachment(item.id, attachment.id);
                    }}
                    className="absolute top-1 right-1 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    title="Remove attachment"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>

                  {isImage && preview?.previewUrl ? (
                    <img src={preview.previewUrl} alt={attachment.name} className="h-24 w-full object-cover pointer-events-none" />
                  ) : (
                    <div className="flex h-24 flex-col items-center justify-center gap-2 px-3 text-center">
                      <FileIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      <div className="line-clamp-2 text-xs text-gray-600 dark:text-gray-300">{attachment.name}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={item.body}
          onChange={handleBodyChange}
          onMouseDown={handleTextareaMouseDown}
          placeholder={item.attachments.length > 0 ? "Add context for these attachments..." : "Type here..."}
          className="w-full min-h-[140px] p-4 resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed cursor-text"
        />

        {item.sync.status === "saving" && (
          <div className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            <LoaderIcon className="h-3 w-3 animate-spin" />
            Saving
          </div>
        )}

        {item.sync.status === "error" && item.sync.lastError && (
          <div className="pointer-events-none absolute right-3 bottom-3 max-w-[70%] rounded bg-red-100 px-2 py-1 text-xs text-red-700 dark:bg-red-900/40 dark:text-red-300">
            {item.sync.lastError}
          </div>
        )}
      </div>

      <div onMouseDown={handleResizeMouseDown} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group" title="Drag to resize">
        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 dark:border-gray-500 opacity-30 group-hover:opacity-70 transition-opacity" />
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { FileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getFile } from "@/lib/scratch/indexeddb";
import type { FileData, ScratchpadItem } from "@/lib/scratch/types";

interface FileItemProps {
  item: ScratchpadItem;
  onUpdate: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
  onDragComplete?: () => void;
}

export function FileItem({ item, onUpdate, onDelete, isSelected, onSelect, onDragComplete }: FileItemProps) {
  const [_fileData, setFileData] = useState<FileData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item.fileRef) {
      getFile(item.fileRef.id).then((data) => {
        setFileData(data);
        // Create preview for images
        if (data?.type.startsWith("image/")) {
          const url = URL.createObjectURL(data.blob);
          setPreviewUrl(url);

          return () => URL.revokeObjectURL(url);
        }
      });
    }
  }, [item.fileRef]);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click
    onSelect(e.ctrlKey || e.metaKey); // Pass Ctrl/Cmd key state for multi-selection

    // Bring clicked card to front (sticky-notes pattern)
    const maxZIndex = Math.max(
      ...Array.from(document.querySelectorAll("[data-scratchpad-item]")).map((el) => parseInt((el as HTMLElement).style.zIndex || "1", 10)),
      0,
    );
    onUpdate(item.id, { zIndex: maxZIndex + 1 });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Prevent text selection during drag initiation (sticky-notes pattern)
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Delete with Backspace
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  const isImage = item.fileRef?.type.startsWith("image/");

  return (
    <motion.div
      data-scratchpad-item="true"
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      onDrag={(_, info) => {
        // Update position in real-time during drag
        onUpdate(item.id, {
          x: item.x + info.delta.x,
          y: item.y + info.delta.y,
        });
      }}
      onDragEnd={() => {
        if (onDragComplete) {
          onDragComplete();
        }
      }}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow focus:outline-none cursor-move ${
        isSelected
          ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-md"
          : item.savedToInstance
            ? "ring-2 ring-green-500 dark:ring-green-500 shadow-md"
            : ""
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        minHeight: item.height,
        zIndex: item.zIndex || 1,
        x: 0, // Reset motion transform
        y: 0,
      }}
      whileDrag={{ opacity: 0.5, cursor: "grabbing" }}
      title={item.savedToInstance ? "Saved to Memos" : "Select and click save to save to Memos"}
    >
      {isImage && previewUrl ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 pointer-events-none">
          <img src={previewUrl} alt={item.fileRef?.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 pointer-events-none">
          <FileIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-3" />
          <div className="text-sm text-center text-gray-700 dark:text-gray-300 font-medium truncate w-full px-2">{item.fileRef?.name}</div>
        </div>
      )}
    </motion.div>
  );
}

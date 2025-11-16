"use client";

import { type DragEvent, useEffect, useRef, useState } from "react";
import type { ScratchpadItem } from "@/lib/scratch/types";
import { FileItem } from "./file-item";
import { TextItem } from "./text-item";

interface WorkspaceProps {
  items: ScratchpadItem[];
  onUpdateItem: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDeleteItem: (id: string) => void;
  onCreateTextItem: (x: number, y: number) => void;
  onFileUpload: (files: FileList, x: number, y: number) => void;
  selectedItemIds: string[];
  onSelectItem: (id: string | null, ctrlKey?: boolean) => void;
  onDragComplete?: () => void;
}

export function Workspace({
  items,
  onUpdateItem,
  onDeleteItem,
  onCreateTextItem,
  onFileUpload,
  selectedItemIds,
  onSelectItem,
  onDragComplete,
}: WorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Track mouse position for paste operation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (workspaceRef.current) {
        const rect = workspaceRef.current.getBoundingClientRect();
        setLastMousePos({
          x: e.clientX - rect.left + workspaceRef.current.scrollLeft,
          y: e.clientY - rect.top + workspaceRef.current.scrollTop,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle paste event for files
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        e.preventDefault();
        const files = e.clipboardData.files;
        // Use last mouse position for paste location
        onFileUpload(files, lastMousePos.x, lastMousePos.y);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [lastMousePos, onFileUpload]);

  const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Deselect when clicking on empty workspace
    const target = e.target as HTMLElement;

    // Check if click is on or within a scratchpad item
    let element: HTMLElement | null = target;
    while (element && element !== workspaceRef.current) {
      if (element.dataset.scratchpadItem === "true") {
        // Clicked on an item, don't deselect
        return;
      }
      element = element.parentElement;
    }

    // Clicked on empty workspace, deselect all
    onSelectItem(null);
  };

  const handleWorkspaceDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only create text item if double-clicking on empty workspace area (not on a card)
    const target = e.target as HTMLElement;

    // Check if double-click is on or within a scratchpad item
    let element: HTMLElement | null = target;
    while (element && element !== workspaceRef.current) {
      if (element.dataset.scratchpadItem === "true") {
        // Double-clicked on an existing item, don't create a new one
        return;
      }
      element = element.parentElement;
    }

    // Create card at double-click location
    const rect = workspaceRef.current?.getBoundingClientRect();
    if (!rect || !workspaceRef.current) return;
    const x = e.clientX - rect.left + workspaceRef.current.scrollLeft;
    const y = e.clientY - rect.top + workspaceRef.current.scrollTop;
    onCreateTextItem(x, y);
  };

  // File drag and drop
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + workspaceRef.current.scrollLeft;
      const y = e.clientY - rect.top + workspaceRef.current.scrollTop;
      onFileUpload(e.dataTransfer.files, x, y);
    }
  };

  // Calculate dynamic workspace size based on items
  const calculateWorkspaceSize = () => {
    if (items.length === 0) {
      // When no items, don't set explicit dimensions to prevent unnecessary scrolling
      return { width: undefined, height: undefined };
    }

    // Padding around the furthest card to allow comfortable scrolling
    const PADDING = 400;

    // Find the maximum extents of all cards
    let maxRight = 0;
    let maxBottom = 0;

    items.forEach((item) => {
      const right = item.x + item.width;
      const bottom = item.y + item.height;

      maxRight = Math.max(maxRight, right);
      maxBottom = Math.max(maxBottom, bottom);
    });

    // Calculate final dimensions with consistent padding
    const width = maxRight + PADDING;
    const height = maxBottom + PADDING;

    return {
      width: `${width}px`,
      height: `${height}px`,
    };
  };

  const workspaceSize = calculateWorkspaceSize();

  return (
    <div
      ref={workspaceRef}
      onClick={handleWorkspaceClick}
      onDoubleClick={handleWorkspaceDoubleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-auto bg-gray-50 dark:bg-gray-900 cursor-default ${
        isDraggingOver ? "ring-4 ring-teal-400 ring-inset" : ""
      }`}
      style={{ minHeight: "100%" }}
    >
      {/* Workspace content area */}
      <div
        className="relative workspace-content"
        style={{
          minWidth: "100%",
          minHeight: "100%",
          width: workspaceSize.width || "100%",
          height: workspaceSize.height || "100%",
        }}
      >
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-gray-400 dark:text-gray-600 text-2xl mb-4">Double-click anywhere to create a card</p>
              <p className="text-gray-400 dark:text-gray-600 text-lg">Paste (Ctrl+V) to add files</p>
            </div>
          </div>
        )}

        {isDraggingOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-teal-500/10">
            <div className="text-center">
              <p className="text-teal-600 dark:text-teal-400 text-2xl font-bold">Drop files here</p>
            </div>
          </div>
        )}

        {/* Render items */}
        {items.map((item) => {
          return item.type === "text" ? (
            <TextItem
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              isSelected={selectedItemIds.includes(item.id)}
              onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
              onDragComplete={onDragComplete}
            />
          ) : (
            <FileItem
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              isSelected={selectedItemIds.includes(item.id)}
              onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
              onDragComplete={onDragComplete}
            />
          );
        })}
      </div>
    </div>
  );
}

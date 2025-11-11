'use client';

import { useState, useRef, useEffect, DragEvent } from 'react';
import type { ScratchpadItem } from '@/lib/scratch/types';
import { TextItem } from './text-item';
import { FileItem } from './file-item';

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
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Use refs to track drag state without causing re-renders
  const dragStateRef = useRef<{ itemId: string; x: number; y: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);

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

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [lastMousePos, onFileUpload]);

  const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Deselect when clicking on empty workspace
    const target = e.target as HTMLElement;

    // Check if click is on or within a scratchpad item
    let element: HTMLElement | null = target;
    while (element && element !== workspaceRef.current) {
      if (element.dataset.scratchpadItem === 'true') {
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
      if (element.dataset.scratchpadItem === 'true') {
        // Double-clicked on an existing item, don't create a new one
        return;
      }
      element = element.parentElement;
    }

    // Create card at double-click location
    const rect = workspaceRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left + workspaceRef.current!.scrollLeft;
    const y = e.clientY - rect.top + workspaceRef.current!.scrollTop;
    onCreateTextItem(x, y);
  };

  const handleItemMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();

    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const workspaceRect = workspaceRef.current?.getBoundingClientRect();
    if (!workspaceRect) return;

    // Calculate offset from item's top-left corner to mouse position
    const mouseXOnWorkspace = e.clientX - workspaceRect.left + workspaceRef.current!.scrollLeft;
    const mouseYOnWorkspace = e.clientY - workspaceRect.top + workspaceRef.current!.scrollTop;

    setDragOffset({
      x: mouseXOnWorkspace - item.x,
      y: mouseYOnWorkspace - item.y,
    });
    setDraggingItemId(itemId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingItemId && workspaceRef.current) {
      const rect = workspaceRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x + workspaceRef.current.scrollLeft;
      const y = e.clientY - rect.top - dragOffset.y + workspaceRef.current.scrollTop;

      // Store position in ref to avoid causing re-renders
      dragStateRef.current = { itemId: draggingItemId, x, y };

      // Use requestAnimationFrame to throttle updates for smooth dragging
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (dragStateRef.current) {
            onUpdateItem(dragStateRef.current.itemId, {
              x: dragStateRef.current.x,
              y: dragStateRef.current.y,
            });
          }
          rafIdRef.current = null;
        });
      }
    }
  };

  const handleMouseUp = () => {
    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    // Commit final position
    if (dragStateRef.current) {
      onUpdateItem(dragStateRef.current.itemId, {
        x: dragStateRef.current.x,
        y: dragStateRef.current.y,
      });
      dragStateRef.current = null;
    }

    if (draggingItemId && onDragComplete) {
      onDragComplete();
    }
    setDraggingItemId(null);
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
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-auto bg-gray-50 dark:bg-gray-900 cursor-default ${
        isDraggingOver ? 'ring-4 ring-teal-400 ring-inset' : ''
      }`}
      style={{ minHeight: '100%' }}
    >
      {/* Workspace content area */}
      <div
        className="relative workspace-content"
        style={{
          minWidth: '100%',
          minHeight: '100%',
          width: workspaceSize.width || '100%',
          height: workspaceSize.height || '100%',
        }}
      >
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-gray-400 dark:text-gray-600 text-2xl mb-4">
                Double-click anywhere to create a card
              </p>
              <p className="text-gray-400 dark:text-gray-600 text-lg">
                Paste (Ctrl+V) to add files
              </p>
            </div>
          </div>
        )}

        {isDraggingOver && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-teal-500/10">
            <div className="text-center">
              <p className="text-teal-600 dark:text-teal-400 text-2xl font-bold">
                Drop files here
              </p>
            </div>
          </div>
        )}

        {/* Render items */}
        {items.map((item) => {
          const handleMouseDownForItem = (e: React.MouseEvent) => handleItemMouseDown(e, item.id);

          return item.type === 'text' ? (
            <TextItem
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              onMouseDown={handleMouseDownForItem}
              isDragging={draggingItemId === item.id}
              isSelected={selectedItemIds.includes(item.id)}
              onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
              onResizeComplete={onDragComplete}
            />
          ) : (
            <FileItem
              key={item.id}
              item={item}
              onDelete={onDeleteItem}
              onMouseDown={handleMouseDownForItem}
              isDragging={draggingItemId === item.id}
              isSelected={selectedItemIds.includes(item.id)}
              onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
            />
          );
        })}
      </div>
    </div>
  );
}

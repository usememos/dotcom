'use client';

import { useState, useRef, useEffect, DragEvent } from 'react';
import { useDrag } from '@use-gesture/react';
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

export function WorkspaceWithGesture({
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Track initial positions for drag
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

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
        onFileUpload(files, lastMousePos.x, lastMousePos.y);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [lastMousePos, onFileUpload]);

  const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    let element: HTMLElement | null = target;
    while (element && element !== workspaceRef.current) {
      if (element.dataset.scratchpadItem === 'true') {
        return;
      }
      element = element.parentElement;
    }
    onSelectItem(null);
  };

  const handleWorkspaceDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    let element: HTMLElement | null = target;
    while (element && element !== workspaceRef.current) {
      if (element.dataset.scratchpadItem === 'true') {
        return;
      }
      element = element.parentElement;
    }

    const rect = workspaceRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left + workspaceRef.current!.scrollLeft;
    const y = e.clientY - rect.top + workspaceRef.current!.scrollTop;
    onCreateTextItem(x, y);
  };

  // Create drag handler for a specific item
  const createDragHandler = (itemId: string) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      const item = items.find((i) => i.id === itemId);
      if (!item) return;

      // Store initial position
      dragStartPos.current = { x: item.x, y: item.y };
      setDraggingItemId(itemId);
    };
  };

  // Use gesture hook for each item
  const createGestureBindings = (itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return {};

    return useDrag(
      ({ offset: [ox, oy], first, last, event }) => {
        event?.preventDefault();
        event?.stopPropagation();

        if (first) {
          setDraggingItemId(itemId);
          dragStartPos.current = { x: item.x, y: item.y };
        }

        if (last) {
          setDraggingItemId(null);
          if (onDragComplete) {
            onDragComplete();
          }
          return;
        }

        // Calculate new position based on drag offset
        const newX = dragStartPos.current.x + ox;
        const newY = dragStartPos.current.y + oy;

        onUpdateItem(itemId, { x: newX, y: newY });
      },
      {
        from: () => [0, 0],
        pointer: { touch: true },
      }
    );
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
      return { width: undefined, height: undefined };
    }

    const PADDING = 400;
    let maxRight = 0;
    let maxBottom = 0;

    items.forEach((item) => {
      const right = item.x + item.width;
      const bottom = item.y + item.height;
      maxRight = Math.max(maxRight, right);
      maxBottom = Math.max(maxBottom, bottom);
    });

    return {
      width: `${maxRight + PADDING}px`,
      height: `${maxBottom + PADDING}px`,
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
        isDraggingOver ? 'ring-4 ring-teal-400 ring-inset' : ''
      }`}
      style={{ minHeight: '100%' }}
    >
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

        {items.map((item) => {
          const handleMouseDownForItem = createDragHandler(item.id);
          const bind = createGestureBindings(item.id);

          return item.type === 'text' ? (
            <div key={item.id} {...bind()}>
              <TextItem
                item={item}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
                onMouseDown={handleMouseDownForItem}
                isDragging={draggingItemId === item.id}
                isSelected={selectedItemIds.includes(item.id)}
                onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
                onResizeComplete={onDragComplete}
              />
            </div>
          ) : (
            <div key={item.id} {...bind()}>
              <FileItem
                item={item}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
                onMouseDown={handleMouseDownForItem}
                isDragging={draggingItemId === item.id}
                isSelected={selectedItemIds.includes(item.id)}
                onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

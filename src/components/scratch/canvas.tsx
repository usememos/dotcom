'use client';

import { useState, useRef, useEffect, DragEvent } from 'react';
import type { ScratchpadItem } from '@/lib/scratch/types';
import { TextItem } from './text-item';
import { FileItem } from './file-item';

interface CanvasProps {
  items: ScratchpadItem[];
  onUpdateItem: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDeleteItem: (id: string) => void;
  onSaveItem: (id: string) => void;
  onCreateTextItem: (x: number, y: number) => void;
  onFileUpload: (files: FileList, x: number, y: number) => void;
}

export function Canvas({
  items,
  onUpdateItem,
  onDeleteItem,
  onSaveItem,
  onCreateTextItem,
  onFileUpload,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Track mouse position for paste operation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setLastMousePos({
          x: e.clientX - rect.left + canvasRef.current.scrollLeft,
          y: e.clientY - rect.top + canvasRef.current.scrollTop,
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only create text item if clicking on the canvas itself
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + canvasRef.current.scrollLeft;
      const y = e.clientY - rect.top + canvasRef.current.scrollTop;
      onCreateTextItem(x, y);
    }
  };

  const handleItemMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    e.preventDefault();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    // Get the position of the item itself, not the target element
    const itemElement = (e.currentTarget as HTMLElement);
    const rect = itemElement.getBoundingClientRect();
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingItemId(itemId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingItemId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x + canvasRef.current.scrollLeft;
      const y = e.clientY - rect.top - dragOffset.y + canvasRef.current.scrollTop;

      onUpdateItem(draggingItemId, { x, y });
    }
  };

  const handleMouseUp = () => {
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left + canvasRef.current.scrollLeft;
      const y = e.clientY - rect.top + canvasRef.current.scrollTop;
      onFileUpload(e.dataTransfer.files, x, y);
    }
  };

  return (
    <div
      ref={canvasRef}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-auto bg-white dark:bg-gray-900 cursor-crosshair ${
        isDraggingOver ? 'ring-4 ring-teal-400 ring-inset' : ''
      }`}
      style={{ minHeight: '100%' }}
    >
      {/* Canvas content area */}
      <div className="relative" style={{ minWidth: '100%', minHeight: '100%', width: '5000px', height: '5000px' }}>
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-gray-400 dark:text-gray-600 text-2xl mb-4">
                Click anywhere to create a card
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
        {items.map((item) => (
          <div
            key={item.id}
            onMouseDown={(e) => handleItemMouseDown(e, item.id)}
            className="cursor-move"
          >
            {item.type === 'text' ? (
              <TextItem
                item={item}
                onUpdate={onUpdateItem}
                onDelete={onDeleteItem}
                onSave={onSaveItem}
                isDragging={draggingItemId === item.id}
              />
            ) : (
              <FileItem
                item={item}
                onDelete={onDeleteItem}
                onSave={onSaveItem}
                isDragging={draggingItemId === item.id}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

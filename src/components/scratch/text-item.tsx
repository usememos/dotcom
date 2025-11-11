'use client';

import { useState, useRef, useEffect } from 'react';
import type { ScratchpadItem } from '@/lib/scratch/types';

interface TextItemProps {
  item: ScratchpadItem;
  onUpdate: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
  onResizeComplete?: () => void;
}

export function TextItem({ item, onUpdate, onDelete, onMouseDown, isDragging, isSelected, onSelect, onResizeComplete }: TextItemProps) {
  const [localContent, setLocalContent] = useState(item.content || '');
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MIN_WIDTH = 200;
  const MIN_HEIGHT = 150;

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [localContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onUpdate(item.id, { content: newContent });

    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click
    onSelect(e.ctrlKey || e.metaKey); // Pass Ctrl/Cmd key state for multi-selection
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Prevent text selection during drag initiation (sticky-notes pattern)
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Delete with Backspace when empty
    if (e.key === 'Backspace' && localContent === '') {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  const handleTextareaMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't start dragging when clicking textarea
  };

  const handleTextareaClick = (e: React.MouseEvent) => {
    // Update timestamp to bring card to front (sticky-notes pattern)
    // This ensures clicked cards come to the top
    const maxZIndex = Math.max(...Array.from(document.querySelectorAll('[data-scratchpad-item]')).map(
      el => parseInt((el as HTMLElement).style.zIndex || '1', 10)
    ), 0);
    onUpdate(item.id, { zIndex: maxZIndex + 1 });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dragging and selection
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

      onUpdate(item.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (onResizeComplete) {
        onResizeComplete();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, item.id, onUpdate, onResizeComplete]);

  return (
    <div
      data-scratchpad-item="true"
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={onMouseDown}
      className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all cursor-move ${
        isDragging ? 'opacity-50 cursor-grabbing' : ''
      } ${
        isSelected
          ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-md'
          : item.savedToInstance
          ? 'ring-2 ring-green-500 dark:ring-green-500 shadow-md'
          : ''
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        minHeight: item.height,
        zIndex: item.zIndex || 1,
      }}
      title={item.savedToInstance ? 'Saved to Memos' : 'Select and click save to save to Memos'}
    >
      <textarea
        ref={textareaRef}
        value={localContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onMouseDown={handleTextareaMouseDown}
        onClick={handleTextareaClick}
        placeholder="Type here..."
        className="w-full h-full min-h-[160px] p-4 resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed cursor-text"
      />
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
        title="Drag to resize"
      >
        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 dark:border-gray-500 opacity-30 group-hover:opacity-70 transition-opacity" />
      </div>
    </div>
  );
}

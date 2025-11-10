'use client';

import { useState, useRef, useEffect } from 'react';
import type { ScratchpadItem } from '@/lib/scratch/types';

interface TextItemProps {
  item: ScratchpadItem;
  onUpdate: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
}

export function TextItem({ item, onUpdate, onDelete, onSave, onMouseDown, isDragging, isSelected, onSelect }: TextItemProps) {
  const [localContent, setLocalContent] = useState(item.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    e.stopPropagation();
    onSave(item.id);
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

  return (
    <div
      data-scratchpad-item="true"
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={onMouseDown}
      className={`absolute bg-amber-50 dark:bg-amber-900/20 rounded-lg shadow-md border border-amber-200 dark:border-amber-800 overflow-hidden hover:shadow-lg transition-shadow cursor-move ${
        isDragging ? 'opacity-50 cursor-grabbing' : ''
      } ${
        isSelected
          ? 'ring-2 ring-blue-500 dark:ring-blue-400'
          : item.savedToInstance
          ? 'ring-2 ring-green-400 dark:ring-green-600'
          : ''
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        minHeight: item.height,
      }}
      title={item.savedToInstance ? 'Saved to Memos' : 'Double-click to save'}
    >
      <textarea
        ref={textareaRef}
        value={localContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onMouseDown={handleTextareaMouseDown}
        placeholder="Type here..."
        className="w-full h-full min-h-[160px] p-4 resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed cursor-text"
      />
    </div>
  );
}

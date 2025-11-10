'use client';

import { useState, useRef, useEffect } from 'react';
import type { ScratchpadItem } from '@/lib/scratch/types';

interface TextItemProps {
  item: ScratchpadItem;
  onUpdate: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
  isDragging?: boolean;
}

export function TextItem({ item, onUpdate, onDelete, onSave, isDragging }: TextItemProps) {
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

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click
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

  return (
    <div
      onClick={handleCardClick}
      onDoubleClick={handleDoubleClick}
      className={`absolute bg-amber-50 dark:bg-amber-900/20 rounded-lg shadow-md border border-amber-200 dark:border-amber-800 overflow-hidden hover:shadow-lg transition-shadow ${
        isDragging ? 'opacity-50' : ''
      } ${item.savedToInstance ? 'ring-2 ring-green-400 dark:ring-green-600' : ''}`}
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
        placeholder="Type here..."
        className="w-full h-full min-h-[160px] p-4 resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed"
      />
    </div>
  );
}

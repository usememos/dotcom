'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ScratchpadItem } from '@/lib/scratch/types';

interface TextItemProps {
  item: ScratchpadItem;
  onUpdate: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
  onDragComplete?: () => void;
}

export function TextItemMotion({ item, onUpdate, onDelete, isSelected, onSelect, onDragComplete }: TextItemProps) {
  const [localContent, setLocalContent] = useState(item.content || '');
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MIN_WIDTH = 200;
  const MIN_HEIGHT = 150;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [localContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    onUpdate(item.id, { content: newContent });

    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(e.ctrlKey || e.metaKey);

    // Bring to front
    const maxZIndex = Math.max(
      ...Array.from(document.querySelectorAll('[data-scratchpad-item]')).map(
        (el) => parseInt((el as HTMLElement).style.zIndex || '1', 10)
      ),
      0
    );
    onUpdate(item.id, { zIndex: maxZIndex + 1 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && localContent === '') {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  const handleTextareaMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
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

      onUpdate(item.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      if (onDragComplete) {
        onDragComplete();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeStart, item.id, onUpdate, onDragComplete]);

  return (
    <motion.div
      data-scratchpad-item="true"
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      onDragStart={(e) => {
        e.stopPropagation();
      }}
      onDrag={(e, info) => {
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
      className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-move ${
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
        x: 0, // Reset motion transform
        y: 0,
      }}
      whileDrag={{ opacity: 0.5, cursor: 'grabbing' }}
      title={item.savedToInstance ? 'Saved to Memos' : 'Select and click save to save to Memos'}
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
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
        title="Drag to resize"
      >
        <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-gray-400 dark:border-gray-500 opacity-30 group-hover:opacity-70 transition-opacity" />
      </div>
    </motion.div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { SaveIcon, TrashIcon, CheckCircleIcon } from 'lucide-react';
import type { ScratchpadItem } from '@/lib/scratch/types';

interface TextItemProps {
  item: ScratchpadItem;
  onUpdate: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
  isDragging?: boolean;
}

export function TextItem({ item, onUpdate, onDelete, onSave, isDragging }: TextItemProps) {
  const [isEditing, setIsEditing] = useState(!item.content);
  const [localContent, setLocalContent] = useState(item.content || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleBlur = () => {
    if (localContent.trim() !== item.content) {
      onUpdate(item.id, { content: localContent });
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(item.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this item?')) {
      onDelete(item.id);
    }
  };

  return (
    <div
      className={`absolute bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        minHeight: item.height,
      }}
    >
      <div className="p-4">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={localContent}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Type your note here... (Markdown supported)"
            className="w-full min-h-[120px] resize-none bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 font-mono text-sm"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="min-h-[120px] cursor-text text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words"
          >
            {item.content || 'Click to edit...'}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {item.savedToInstance && (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Saved
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={!!item.savedToInstance}
            className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Save to Memos"
          >
            <SaveIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

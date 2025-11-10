'use client';

import { useState, useEffect } from 'react';
import { FileIcon } from 'lucide-react';
import type { ScratchpadItem, FileData } from '@/lib/scratch/types';
import { getFile } from '@/lib/scratch/indexeddb';

interface FileItemProps {
  item: ScratchpadItem;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging?: boolean;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
}

export function FileItem({ item, onDelete, onSave, onMouseDown, isDragging, isSelected, onSelect }: FileItemProps) {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (item.fileRef) {
      getFile(item.fileRef.id).then((data) => {
        setFileData(data);
        // Create preview for images
        if (data && data.type.startsWith('image/')) {
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
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Delete with Backspace
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  const isImage = item.fileRef?.type.startsWith('image/');

  return (
    <div
      data-scratchpad-item="true"
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={onMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`absolute bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow focus:outline-none cursor-move ${
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
      {isImage && previewUrl ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 pointer-events-none">
          <img
            src={previewUrl}
            alt={item.fileRef?.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 pointer-events-none">
          <FileIcon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-3" />
          <div className="text-sm text-center text-gray-700 dark:text-gray-300 font-medium truncate w-full px-2">
            {item.fileRef?.name}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { SaveIcon, TrashIcon, EyeIcon, FileIcon, ImageIcon, CheckCircleIcon } from 'lucide-react';
import type { ScratchpadItem, FileData } from '@/lib/scratch/types';
import { getFile } from '@/lib/scratch/indexeddb';
import { formatBytes } from '@/lib/scratch/storage';

interface FileItemProps {
  item: ScratchpadItem;
  onDelete: (id: string) => void;
  onSave: (id: string) => void;
  isDragging?: boolean;
}

export function FileItem({ item, onDelete, onSave, isDragging }: FileItemProps) {
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

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(item.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this file?')) {
      onDelete(item.id);
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileData) {
      const url = URL.createObjectURL(fileData.blob);
      window.open(url, '_blank');
    }
  };

  const isImage = item.fileRef?.type.startsWith('image/');

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
        {isImage && previewUrl ? (
          <div className="flex items-center justify-center mb-3 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt={item.fileRef?.name}
              className="max-w-full max-h-48 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center mb-3 h-32 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <div className="text-sm">
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate mb-1" title={item.fileRef?.name}>
            {isImage && <ImageIcon className="w-4 h-4 inline mr-1" />}
            {!isImage && <FileIcon className="w-4 h-4 inline mr-1" />}
            {item.fileRef?.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {item.fileRef && formatBytes(item.fileRef.size)}
          </div>
        </div>
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
            onClick={handleView}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
            title="View"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
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

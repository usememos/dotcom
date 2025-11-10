/**
 * IndexedDB utilities for storing file blobs
 */

import type { FileData } from './types';

const DB_NAME = 'memos-scratch';
const DB_VERSION = 1;
const STORE_NAME = 'files';

/**
 * Open IndexedDB connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false });
      }
    };
  });
}

/**
 * Save a file to IndexedDB
 */
export async function saveFile(file: FileData): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get a file from IndexedDB
 */
export async function getFile(id: string): Promise<FileData | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? { ...result, uploadedAt: new Date(result.uploadedAt) } : null);
    };

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get all files from IndexedDB
 */
export async function getAllFiles(): Promise<FileData[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result || [];
      resolve(
        results.map((file: FileData) => ({
          ...file,
          uploadedAt: new Date(file.uploadedAt),
        }))
      );
    };

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Delete a file from IndexedDB
 */
export async function deleteFile(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Clear all files from IndexedDB
 */
export async function clearAllFiles(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get total size of all files in IndexedDB
 */
export async function getTotalFileSize(): Promise<number> {
  const files = await getAllFiles();
  return files.reduce((total, file) => total + file.size, 0);
}

/**
 * Delete files older than specified days
 */
export async function deleteOldFiles(daysOld: number = 30): Promise<number> {
  const files = await getAllFiles();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  let deletedCount = 0;
  for (const file of files) {
    if (file.uploadedAt < cutoffDate) {
      await deleteFile(file.id);
      deletedCount++;
    }
  }

  return deletedCount;
}

/**
 * Create a file data object from a File or Blob
 */
export function createFileData(file: File | Blob, name?: string): FileData {
  const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id,
    name: name || (file instanceof File ? file.name : 'untitled'),
    type: file.type || 'application/octet-stream',
    size: file.size,
    blob: file,
    uploadedAt: new Date(),
  };
}

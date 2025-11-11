/**
 * TypeScript interfaces and types for the Memos Scratchpad feature
 */

export interface MemoInstance {
  id: string;
  name: string;              // e.g., "Personal Notes"
  url: string;               // https://memo.example.com
  accessToken: string;       // Encrypted
  isDefault: boolean;
  lastConnected: Date | null;
  status: 'connected' | 'error' | 'untested';
}

export interface ScratchpadItem {
  id: string;
  type: 'text' | 'file';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;            // Stacking order (higher = on top)

  content?: string;          // For text items (markdown)

  fileRef?: {                // For file items
    id: string;              // IndexedDB key
    name: string;
    type: string;            // MIME type
    size: number;
  };

  savedToInstance?: string;  // Instance ID if saved
  savedMemoId?: string;      // Remote memo ID

  createdAt: Date;
}

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  uploadedAt: Date;
}

export interface StorageQuota {
  usage: number;
  quota: number;
  percentage: number;
}

export interface SaveToMemosOptions {
  instanceId: string;
  tags?: string[];
  visibility?: 'PRIVATE' | 'PUBLIC' | 'PROTECTED';
}

export interface MemoResource {
  id: string;
  name: string;
  filename: string;
  externalLink: string;
  type: string;
  size: number;
}

export interface Memo {
  id: string;
  content: string;
  visibility: string;
  createdTs: number;
  updatedTs: number;
  resourceList?: MemoResource[];
}

export interface UserInfo {
  id: string;
  username: string;
  role: string;
  email?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  username?: string;
  error?: string;
}

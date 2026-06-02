/**
 * TypeScript interfaces and types for the local Scratchpad feature.
 */

export interface ScratchpadAttachmentRef {
  id: string; // IndexedDB key
  name: string;
  type: string; // MIME type
  size: number;
}

export interface ScratchpadViewport {
  x: number;
  y: number;
  scale: number;
}

export interface ScratchpadItemLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // Stacking order (higher = on top)
}

export interface ScratchpadItemContent {
  body: string;
  attachments: ScratchpadAttachmentRef[];
}

export interface ScratchpadItemTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export type ScratchpadCardTone = "yellow" | "pink" | "blue" | "green" | "purple";

export interface ScratchpadItem {
  id: string;
  layout: ScratchpadItemLayout;
  content: ScratchpadItemContent;
  timestamps: ScratchpadItemTimestamps;
  tone?: ScratchpadCardTone;
}

export interface ScratchpadDocument {
  items: ScratchpadItem[];
}

export interface ScratchpadItemPatch {
  layout?: Partial<ScratchpadItemLayout>;
  content?: Partial<ScratchpadItemContent>;
  timestamps?: Partial<ScratchpadItemTimestamps>;
  tone?: ScratchpadCardTone;
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

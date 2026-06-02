"use client";

import { FileIcon, XIcon } from "lucide-react";
import type { ScratchpadAttachmentRef } from "../types";

interface ScratchpadAttachmentPreview {
  previewUrl: string | null;
}

interface ScratchpadAttachmentGridProps {
  itemId: string;
  attachments: ScratchpadAttachmentRef[];
  previewMap: Map<string, ScratchpadAttachmentPreview>;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
}

export function ScratchpadAttachmentGrid({ itemId, attachments, previewMap, onRemoveAttachment }: ScratchpadAttachmentGridProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="relative px-4 pt-4 pb-2.5">
      <div className="grid grid-cols-2 gap-2">
        {attachments.map((attachment) => {
          const preview = previewMap.get(attachment.id);
          const isImage = attachment.type.startsWith("image/");

          return (
            <div
              key={attachment.id}
              className={`group relative overflow-hidden rounded-[3px] border border-black/10 bg-white/25 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] ${
                isImage ? "pb-3" : ""
              }`}
            >
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  void onRemoveAttachment(itemId, attachment.id);
                }}
                className="absolute right-1.5 top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-900/45 text-white opacity-0 transition group-hover:opacity-100"
                title="Remove attachment"
              >
                <XIcon className="h-3 w-3" />
              </button>

              {isImage && preview?.previewUrl ? (
                <>
                  <div className="overflow-hidden rounded-[2px] bg-white/30">
                    <img
                      src={preview.previewUrl}
                      alt={attachment.name}
                      className="h-24 w-full object-cover pointer-events-none opacity-92"
                    />
                  </div>
                  <div className="pt-1.5 text-center text-[9px] italic tracking-[0.02em] text-current opacity-55">{attachment.name}</div>
                </>
              ) : (
                <div className="flex h-24 flex-col items-center justify-center gap-2 px-2 text-center">
                  <FileIcon className="h-7 w-7 text-current opacity-45" />
                  <div className="line-clamp-2 text-[10px] leading-4.5 text-current opacity-65">{attachment.name}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

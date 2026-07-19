"use client";

import { FileIcon, XIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { ScratchpadAttachmentRef } from "../types";

interface ScratchpadAttachmentPreview {
  previewUrl: string | null;
}

interface ScratchpadAttachmentGridProps {
  itemId: string;
  attachments: ScratchpadAttachmentRef[];
  previewMap: Map<string, ScratchpadAttachmentPreview>;
  onOpenAttachment: (attachment: ScratchpadAttachmentRef) => void;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
}

export function ScratchpadAttachmentGrid({
  itemId,
  attachments,
  previewMap,
  onOpenAttachment,
  onRemoveAttachment,
}: ScratchpadAttachmentGridProps) {
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
              className={`group relative overflow-hidden rounded-[5px] border border-stone-900/10 bg-white/35 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] dark:border-white/10 dark:bg-white/5 ${
                isImage ? "pb-3" : ""
              }`}
            >
              <Button
                variant="ghost"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenAttachment(attachment);
                }}
                aria-label={`Open attachment ${attachment.name}`}
                className="absolute inset-0 z-0 h-auto w-auto rounded-[5px] p-0 hover:bg-transparent focus-visible:ring-stone-900/30 dark:hover:bg-transparent dark:focus-visible:ring-stone-100/40"
              />

              <Button
                variant="ghost"
                size="icon-xs"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  void onRemoveAttachment(itemId, attachment.id);
                }}
                aria-label="Remove attachment"
                className="absolute right-1.5 top-1.5 z-10 size-5 rounded-full bg-stone-900/55 p-0 text-white opacity-0 hover:bg-stone-900/75 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-white/80 dark:bg-stone-100/20 dark:hover:bg-stone-100/30 dark:focus-visible:ring-stone-200/60"
                title="Remove attachment"
              >
                <XIcon className="h-3 w-3" />
              </Button>

              <div className="pointer-events-none relative z-[1]">
                {isImage && preview?.previewUrl ? (
                  <>
                    <div className="overflow-hidden rounded-[2px] bg-white/30">
                      <img
                        src={preview.previewUrl}
                        alt={attachment.name}
                        className="h-24 w-full object-cover pointer-events-none opacity-95"
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { motion, useMotionValue } from "framer-motion";
import { FileIcon, LoaderIcon, XIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFile } from "@/lib/scratch/indexeddb";
import {
  beginPointerInteraction,
  cancelPointerInteraction,
  createIdlePointerInteractionState,
  createPointerSession,
  finishPointerInteraction,
  getActivePointerInteraction,
  getPointerSessionDelta,
  hasPointerSessionExceededThreshold,
  isPointerInteractionMode,
  type PointerInteractionMap,
  type PointerSession,
} from "@/lib/scratch/interactions";
import type { FileData, ScratchpadItem } from "@/lib/scratch/types";

interface CardItemProps {
  item: ScratchpadItem;
  canvasScale: number;
  onUpdateBody: (id: string, body: string) => void;
  onUpdateLayout: (id: string, updates: Partial<ScratchpadItem>) => void;
  onDelete: (id: string) => void;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
}

interface AttachmentPreview {
  id: string;
  fileData: FileData | null;
  previewUrl: string | null;
}

interface DragSession extends PointerSession {
  moved: boolean;
}

interface ResizeSession extends PointerSession {
  startWidth: number;
  startHeight: number;
  latestWidth: number;
  latestHeight: number;
}

interface CardInteractionMap extends PointerInteractionMap {
  dragging: DragSession;
  resizing: ResizeSession;
}

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function formatCardTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getCardRotation(item: ScratchpadItem): number {
  const rotationBucket = (hashString(item.id) % 7) - 3;
  return rotationBucket * 0.65;
}

function getCardRingClass(item: ScratchpadItem, isSelected?: boolean): string {
  if (isSelected) {
    return "ring-2 ring-[#d0b449]/55 shadow-[0_30px_70px_rgba(145,120,41,0.2)]";
  }

  if (item.sync.status === "error") {
    return "ring-2 ring-red-300/80 shadow-[0_24px_60px_rgba(148,67,49,0.18)]";
  }

  if (item.sync.status === "saving") {
    return "ring-2 ring-amber-300/80 shadow-[0_24px_60px_rgba(163,116,38,0.18)]";
  }

  if (item.sync.status === "synced") {
    return "ring-2 ring-emerald-200/80 shadow-[0_24px_60px_rgba(108,125,87,0.14)]";
  }

  return "";
}

export function CardItem({
  item,
  canvasScale,
  onUpdateBody,
  onUpdateLayout,
  onDelete,
  onRemoveAttachment,
  isSelected,
  onSelect,
}: CardItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragOriginRef = useRef({ x: 0, y: 0 });
  const interactionRef = useRef(createIdlePointerInteractionState<CardInteractionMap>());
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const widthMotion = useMotionValue(item.width);
  const heightMotion = useMotionValue(item.height);

  const MIN_WIDTH = 220;
  const MIN_HEIGHT = 170;
  const cardRotation = useMemo(() => getCardRotation(item), [item]);
  const cardTimestamp = useMemo(() => formatCardTime(item.updatedAt), [item.updatedAt]);
  const hasImageAttachment = item.attachments.some((attachment) => attachment.type.startsWith("image/"));

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [item.body]);

  useEffect(() => {
    if (!isResizing) {
      widthMotion.set(item.width);
      heightMotion.set(item.height);
    }
  }, [heightMotion, isResizing, item.height, item.width, widthMotion]);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    const loadAttachments = async () => {
      const previews = await Promise.all(
        item.attachments.map(async (attachment) => {
          const fileData = await getFile(attachment.id);
          if (!fileData) {
            return {
              id: attachment.id,
              fileData: null,
              previewUrl: null,
            };
          }

          if (fileData.type.startsWith("image/")) {
            const url = URL.createObjectURL(fileData.blob);
            urls.push(url);
            return {
              id: attachment.id,
              fileData,
              previewUrl: url,
            };
          }

          return {
            id: attachment.id,
            fileData,
            previewUrl: null,
          };
        }),
      );

      if (!cancelled) {
        setAttachmentPreviews(previews);
      }
    };

    void loadAttachments();

    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [item.attachments]);

  const previewMap = useMemo(() => new Map(attachmentPreviews.map((preview) => [preview.id, preview])), [attachmentPreviews]);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Backspace" || e.key === "Delete") && item.body === "" && item.attachments.length === 0) {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  const handleTextareaPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateBody(item.id, e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const finishDrag = (session: DragSession, clientX: number, clientY: number) => {
    const deltaX = (clientX - session.startClientX) / canvasScale;
    const deltaY = (clientY - session.startClientY) / canvasScale;

    if (session.moved) {
      onUpdateLayout(item.id, {
        x: dragOriginRef.current.x + deltaX,
        y: dragOriginRef.current.y + deltaY,
      });
    }

    dragX.set(0);
    dragY.set(0);
    setIsDragging(false);
  };

  const cancelDrag = () => {
    dragX.set(0);
    dragY.set(0);
    setIsDragging(false);
  };

  const handleCardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isPointerInteractionMode(interactionRef.current, "resizing")) {
      return;
    }

    e.stopPropagation();
    onSelect(e.ctrlKey || e.metaKey);

    dragOriginRef.current = {
      x: item.x,
      y: item.y,
    };
    beginPointerInteraction(interactionRef, e.currentTarget, "dragging", {
      ...createPointerSession(e.pointerId, e.clientX, e.clientY),
      moved: false,
    });
    dragX.set(0);
    dragY.set(0);
    setIsDragging(true);
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = getActivePointerInteraction(interactionRef, "dragging", e.pointerId);
    if (!session) {
      return;
    }

    const delta = getPointerSessionDelta(session, e.clientX, e.clientY);

    if (!session.moved && hasPointerSessionExceededThreshold(session, e.clientX, e.clientY, 2)) {
      session.moved = true;
    }

    dragX.set(delta.x / canvasScale);
    dragY.set(delta.y / canvasScale);
  };

  const handleCardPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = finishPointerInteraction(interactionRef, e.currentTarget, "dragging", e.pointerId);
    if (!session) {
      return;
    }

    finishDrag(session, e.clientX, e.clientY);
  };

  const handleCardPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cancelPointerInteraction(interactionRef, "dragging", e.pointerId)) {
      return;
    }

    cancelDrag();
  };

  const finishResize = (session: ResizeSession) => {
    onUpdateLayout(item.id, {
      width: session.latestWidth,
      height: session.latestHeight,
    });
    setIsResizing(false);
  };

  const cancelResize = () => {
    widthMotion.set(item.width);
    heightMotion.set(item.height);
    setIsResizing(false);
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    beginPointerInteraction(interactionRef, e.currentTarget, "resizing", {
      ...createPointerSession(e.pointerId, e.clientX, e.clientY),
      startWidth: item.width,
      startHeight: item.height,
      latestWidth: item.width,
      latestHeight: item.height,
    });
    widthMotion.set(item.width);
    heightMotion.set(item.height);
    setIsResizing(true);
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = getActivePointerInteraction(interactionRef, "resizing", e.pointerId);
    if (!session) {
      return;
    }

    const delta = getPointerSessionDelta(session, e.clientX, e.clientY);
    const nextWidth = Math.max(MIN_WIDTH, session.startWidth + delta.x / canvasScale);
    const nextHeight = Math.max(MIN_HEIGHT, session.startHeight + delta.y / canvasScale);

    session.latestWidth = nextWidth;
    session.latestHeight = nextHeight;
    widthMotion.set(nextWidth);
    heightMotion.set(nextHeight);
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = finishPointerInteraction(interactionRef, e.currentTarget, "resizing", e.pointerId);
    if (!session) {
      return;
    }

    finishResize(session);
  };

  const handleResizePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cancelPointerInteraction(interactionRef, "resizing", e.pointerId)) {
      return;
    }

    cancelResize();
  };

  useEffect(() => {
    return () => {
      interactionRef.current = createIdlePointerInteractionState<CardInteractionMap>();
    };
  }, []);

  return (
    <motion.div
      data-scratchpad-item="true"
      data-scratchpad-item-id={item.id}
      onPointerDown={handleCardPointerDown}
      onPointerMove={handleCardPointerMove}
      onPointerUp={handleCardPointerUp}
      onPointerCancel={handleCardPointerCancel}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`absolute flex flex-col overflow-hidden rounded-[4px] border border-[#e5d57d] bg-[#fff2a8] text-stone-700 shadow-[0_18px_36px_rgba(120,101,38,0.18)] transition-[box-shadow,transform] duration-150 focus:outline-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${getCardRingClass(item, isSelected)}`}
      style={{
        left: item.x,
        top: item.y,
        width: widthMotion,
        minHeight: heightMotion,
        zIndex: item.zIndex || 1,
        x: dragX,
        y: dragY,
      }}
      animate={
        isDragging
          ? {
              rotate: 0,
              scale: 1.01,
              boxShadow: "0 24px 54px rgba(90, 74, 53, 0.18)",
            }
          : {
              rotate: isSelected ? 0 : cardRotation,
              scale: 1,
              boxShadow: "0 18px 36px rgba(120, 101, 38, 0.18)",
            }
      }
      transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.45 }}
      title={item.sync.status === "synced" ? "Saved to Memos" : "Select and click save to save to Memos"}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,210,0.35),rgba(255,240,157,0.95))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0))]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-6 w-16 -translate-x-1/2 -translate-y-2 rounded-b-[10px] bg-white/42 blur-[0.2px]" />

      <div className="relative flex items-center justify-between px-4 pt-3 pb-1.5">
        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#b7a253]">Note</span>
        <span className="text-[9px] font-medium tabular-nums text-[#c8b96f]">{cardTimestamp}</span>
      </div>

      {item.attachments.length > 0 && (
        <div className="relative px-4 pb-2.5">
          <div className="grid grid-cols-2 gap-2">
            {item.attachments.map((attachment) => {
              const preview = previewMap.get(attachment.id);
              const isImage = attachment.type.startsWith("image/");

              return (
                <div
                  key={attachment.id}
                  className={`group relative overflow-hidden rounded-[3px] border border-[#eadb8f]/85 bg-[#fff6bf]/72 p-1.5 ${
                    isImage ? "pb-3" : ""
                  }`}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void onRemoveAttachment(item.id, attachment.id);
                    }}
                    className="absolute right-1.5 top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-900/45 text-white opacity-0 transition group-hover:opacity-100"
                    title="Remove attachment"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>

                  {isImage && preview?.previewUrl ? (
                    <>
                      <div className="overflow-hidden rounded-[2px] bg-[#fff9d8]">
                        <img
                          src={preview.previewUrl}
                          alt={attachment.name}
                          className="h-24 w-full object-cover pointer-events-none opacity-92"
                        />
                      </div>
                      <div className="pt-1.5 text-center text-[9px] italic tracking-[0.02em] text-[#b7a45e]">{attachment.name}</div>
                    </>
                  ) : (
                    <div className="flex h-24 flex-col items-center justify-center gap-2 px-2 text-center">
                      <FileIcon className="h-7 w-7 text-[#c8b668]" />
                      <div className="line-clamp-2 text-[10px] leading-4.5 text-[#9a8740]">{attachment.name}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative flex-1 px-4 pb-3.5">
        {!hasImageAttachment && item.body.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#dccb75]/75 to-transparent" />
        )}
        <textarea
          ref={textareaRef}
          value={item.body}
          onChange={handleBodyChange}
          onPointerDown={handleTextareaPointerDown}
          placeholder={item.attachments.length > 0 ? "Add context for these attachments..." : "Type here..."}
          className="w-full min-h-[150px] resize-none border-none bg-transparent px-0 pt-2.5 pb-1.5 font-serif text-[14px] leading-7 text-[#6e5d23] outline-none placeholder:text-[#c8bb7e] cursor-text"
        />

        {item.sync.status === "saving" && (
          <div className="pointer-events-none absolute right-0 bottom-0 inline-flex items-center gap-1 rounded-full bg-[#f8e693] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#947d2d]">
            <LoaderIcon className="h-3 w-3 animate-spin" />
            Saving
          </div>
        )}

        {item.sync.status === "error" && item.sync.lastError && (
          <div className="pointer-events-none absolute right-0 bottom-0 max-w-[78%] rounded-full bg-red-50/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-red-600">
            {item.sync.lastError}
          </div>
        )}
      </div>

      <div
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerCancel}
        className="absolute bottom-0 right-0 h-6 w-6 cursor-se-resize group"
        title="Drag to resize"
      >
        <div className="absolute bottom-1.5 right-1.5 h-3 w-3 border-r border-b border-[#c1a73b] opacity-55 transition-opacity group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}

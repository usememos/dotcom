"use client";

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

const CARD_TEXT_CLASS_NAME = "font-serif text-[14px] leading-7 text-[#6e5d23]";

export function CardItem({ item, canvasScale, onUpdateBody, onUpdateLayout, onRemoveAttachment, isSelected, onSelect }: CardItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(
    () => item.body.trim().length === 0 && item.attachments.length === 0 && Date.now() - item.createdAt.getTime() < 5_000,
  );
  const [isResizing, setIsResizing] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<AttachmentPreview[]>([]);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [liveSize, setLiveSize] = useState({ width: item.width, height: item.height });
  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragOriginRef = useRef({ x: 0, y: 0 });
  const shouldSelectOnMountRef = useRef(isEditing);
  const interactionRef = useRef(createIdlePointerInteractionState<CardInteractionMap>());

  const MIN_WIDTH = 220;
  const MIN_HEIGHT = 170;
  const cardRotation = useMemo(() => getCardRotation(item), [item]);
  const hasImageAttachment = item.attachments.some((attachment) => attachment.type.startsWith("image/"));
  const hasBody = item.body.trim().length > 0;

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [item.body]);

  useEffect(() => {
    if (!isEditing || !textareaRef.current) return;

    textareaRef.current.focus();
    const nextSelectionStart = textareaRef.current.value.length;
    textareaRef.current.setSelectionRange(nextSelectionStart, nextSelectionStart);
  }, [isEditing]);

  useEffect(() => {
    if (!shouldSelectOnMountRef.current) return;

    shouldSelectOnMountRef.current = false;
    onSelect(false);
  }, [onSelect]);

  useEffect(() => {
    if (!isEditing) return;

    const handlePointerDownOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (cardRef.current?.contains(target)) return;
      setIsEditing(false);
    };

    window.addEventListener("pointerdown", handlePointerDownOutside, true);
    return () => window.removeEventListener("pointerdown", handlePointerDownOutside, true);
  }, [isEditing]);

  useEffect(() => {
    if (!isResizing) {
      setLiveSize({
        width: item.width,
        height: item.height,
      });
    }
  }, [isResizing, item.height, item.width]);

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
    onSelect(false);
    setIsEditing(true);
  };

  const handleKeyboardTargetFocus = () => {
    onSelect(false);
  };

  const handleKeyboardTargetKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(false);
      setIsEditing(true);
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

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.currentTarget.blur();
    }

    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
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

    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const cancelDrag = () => {
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleCardPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isEditing || isPointerInteractionMode(interactionRef.current, "resizing")) {
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
    setDragOffset({ x: 0, y: 0 });
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

    setDragOffset({
      x: delta.x / canvasScale,
      y: delta.y / canvasScale,
    });
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
    setLiveSize({
      width: item.width,
      height: item.height,
    });
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
    setLiveSize({
      width: item.width,
      height: item.height,
    });
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
    setLiveSize({
      width: nextWidth,
      height: nextHeight,
    });
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

  const rotation = isSelected ? 0 : cardRotation;

  return (
    <div
      ref={cardRef}
      data-scratchpad-item="true"
      data-scratchpad-item-id={item.id}
      onPointerDown={handleCardPointerDown}
      onPointerMove={handleCardPointerMove}
      onPointerUp={handleCardPointerUp}
      onPointerCancel={handleCardPointerCancel}
      onClick={handleContainerClick}
      onDoubleClick={handleDoubleClick}
      className={`absolute flex flex-col overflow-hidden rounded-[4px] border border-[#e5d57d] bg-[#fff2a8] text-stone-700 transition-shadow duration-150 focus:outline-none ${
        isEditing ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${getCardRingClass(item, isSelected)}`}
      style={{
        left: item.x,
        top: item.y,
        width: liveSize.width,
        minHeight: liveSize.height,
        zIndex: item.zIndex || 1,
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`,
        touchAction: isEditing ? "auto" : "none",
      }}
      title={item.sync.status === "synced" ? "Saved to Memos" : "Select and click save to save to Memos"}
    >
      {!isEditing && (
        <button
          type="button"
          onFocus={handleKeyboardTargetFocus}
          onKeyDown={handleKeyboardTargetKeyDown}
          className="absolute inset-0 z-0"
          aria-label={hasBody ? `Edit note: ${item.body.slice(0, 60)}` : "Edit note"}
        >
          <span className="sr-only">Select note. Press Enter to edit.</span>
        </button>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,210,0.28),rgba(255,240,157,0.95))]" />

      {item.attachments.length > 0 && (
        <div className="relative px-4 pt-4 pb-2.5">
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
                >
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
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

      <div className="relative flex-1 px-4 pt-3 pb-3.5">
        {!hasImageAttachment && item.body.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#dccb75]/75 to-transparent" />
        )}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={item.body}
            onBlur={() => setIsEditing(false)}
            onChange={handleBodyChange}
            onKeyDown={handleTextareaKeyDown}
            onPointerDown={handleTextareaPointerDown}
            placeholder={item.attachments.length > 0 ? "Add context for these attachments..." : "Type here..."}
            className={`w-full min-h-[150px] resize-none border-none bg-transparent px-0 pt-0 pb-1.5 outline-none placeholder:text-[#c8bb7e] cursor-text ${CARD_TEXT_CLASS_NAME}`}
          />
        ) : (
          <div
            className={`min-h-[150px] px-0 pt-0 pb-1.5 ${CARD_TEXT_CLASS_NAME} ${
              hasBody ? "whitespace-pre-wrap break-words" : "select-none text-[#c8bb7e]"
            }`}
          >
            {hasBody ? item.body : item.attachments.length > 0 ? "Double-click to describe these attachments..." : "Double-click to type"}
          </div>
        )}

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
    </div>
  );
}

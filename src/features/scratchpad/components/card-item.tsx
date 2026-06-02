"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAttachmentPreviews } from "../hooks/use-attachment-previews";
import { getCardRingClass, getCardRotation, getCardToneClassNames } from "../lib/card-style";
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
} from "../lib/interactions";
import type { ScratchpadItem, ScratchpadItemLayout } from "../types";
import { ScratchpadAttachmentGrid } from "./scratchpad-attachment-grid";
import { ScratchpadCardBody } from "./scratchpad-card-body";
import { ScratchpadSyncBadge } from "./scratchpad-sync-badge";

interface CardItemProps {
  item: ScratchpadItem;
  canvasScale: number;
  onUpdateBody: (id: string, body: string) => void;
  onUpdateLayout: (id: string, updates: Partial<ScratchpadItemLayout>) => void;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
  isSelected?: boolean;
  onSelect: (ctrlKey: boolean) => void;
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

export function CardItem({ item, canvasScale, onUpdateBody, onUpdateLayout, onRemoveAttachment, isSelected, onSelect }: CardItemProps) {
  const { content, layout, timestamps } = item;
  const { body, attachments } = content;
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(
    () => body.trim().length === 0 && attachments.length === 0 && Date.now() - timestamps.createdAt.getTime() < 5_000,
  );
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [liveSize, setLiveSize] = useState({ width: layout.width, height: layout.height });
  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragOriginRef = useRef({ x: 0, y: 0 });
  const shouldSelectOnMountRef = useRef(isEditing);
  const interactionRef = useRef(createIdlePointerInteractionState<CardInteractionMap>());

  const MIN_WIDTH = 220;
  const MIN_HEIGHT = 170;
  const cardRotation = useMemo(() => getCardRotation(item), [item]);
  const previewMap = useAttachmentPreviews(attachments);
  const hasImageAttachment = attachments.some((attachment) => attachment.type.startsWith("image/"));
  const hasBody = body.trim().length > 0;

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [body]);

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
        width: layout.width,
        height: layout.height,
      });
    }
  }, [isResizing, layout.height, layout.width]);

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
      x: layout.x,
      y: layout.y,
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
      width: layout.width,
      height: layout.height,
    });
    setIsResizing(false);
  };

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    beginPointerInteraction(interactionRef, e.currentTarget, "resizing", {
      ...createPointerSession(e.pointerId, e.clientX, e.clientY),
      startWidth: layout.width,
      startHeight: layout.height,
      latestWidth: layout.width,
      latestHeight: layout.height,
    });
    setLiveSize({
      width: layout.width,
      height: layout.height,
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
      className={`group/card absolute flex flex-col overflow-hidden rounded-[4px] border transition-shadow duration-150 focus:outline-none ${getCardToneClassNames(item)} ${
        isEditing ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${getCardRingClass(item, isSelected)}`}
      style={{
        left: layout.x,
        top: layout.y,
        width: liveSize.width,
        minHeight: liveSize.height,
        zIndex: layout.zIndex || 1,
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
          aria-label={hasBody ? `Edit note: ${body.slice(0, 60)}` : "Edit note"}
        >
          <span className="sr-only">Select note. Press Enter to edit.</span>
        </button>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,210,0.28),rgba(255,240,157,0.95))]" />

      <ScratchpadAttachmentGrid
        itemId={item.id}
        attachments={attachments}
        previewMap={previewMap}
        onRemoveAttachment={onRemoveAttachment}
      />

      <div className="relative flex-1 px-4 pt-3 pb-3.5">
        {!hasImageAttachment && body.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-current/20 to-transparent" />
        )}
        <ScratchpadCardBody
          body={body}
          hasAttachments={attachments.length > 0}
          isEditing={isEditing}
          textClassName=""
          placeholderClassName="text-stone-500"
          textareaRef={textareaRef}
          onBlur={() => setIsEditing(false)}
          onChange={handleBodyChange}
          onKeyDown={handleTextareaKeyDown}
          onPointerDown={handleTextareaPointerDown}
        />

        <ScratchpadSyncBadge sync={item.sync} isRevealed={Boolean(isSelected)} />
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

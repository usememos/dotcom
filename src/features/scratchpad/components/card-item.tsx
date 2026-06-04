"use client";

import { TrashIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAttachmentPreviews } from "../hooks/use-attachment-previews";
import {
  getCardChromeClassNames,
  getCardResizeHandleClassNames,
  getCardRingClass,
  getCardRotation,
  getCardToneClassNames,
} from "../lib/card-style";
import { clampContextMenuPosition } from "../lib/context-menu-position";
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
import type { ScratchpadAttachmentRef, ScratchpadItem, ScratchpadItemLayout } from "../types";
import { ScratchpadAttachmentGrid } from "./scratchpad-attachment-grid";
import { ScratchpadCardBody } from "./scratchpad-card-body";

interface CardItemProps {
  item: ScratchpadItem;
  canvasScale: number;
  onUpdateBody: (id: string, body: string) => void;
  onUpdateLayout: (id: string, updates: Partial<ScratchpadItemLayout>) => void;
  onDelete: (id: string) => void;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
  onOpenAttachment: (attachment: ScratchpadAttachmentRef) => void;
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

interface CardContextMenuState {
  x: number;
  y: number;
}

const CARD_CONTEXT_MENU_WIDTH = 128;
const CARD_CONTEXT_MENU_HEIGHT = 44;
const CARD_CONTEXT_MENU_GUTTER = 8;

export function CardItem({
  item,
  canvasScale,
  onUpdateBody,
  onUpdateLayout,
  onDelete,
  onRemoveAttachment,
  onOpenAttachment,
  isSelected,
  onSelect,
}: CardItemProps) {
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
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragOriginRef = useRef({ x: 0, y: 0 });
  const shouldSelectOnMountRef = useRef(isEditing);
  const interactionRef = useRef(createIdlePointerInteractionState<CardInteractionMap>());
  const [contextMenu, setContextMenu] = useState<CardContextMenuState | null>(null);

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

  useEffect(() => {
    if (!contextMenu) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && contextMenuRef.current?.contains(target)) {
        return;
      }

      setContextMenu(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  const rotation = isSelected ? 0 : cardRotation;

  const handleCardContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditing) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    onSelect(false);
    setContextMenu(
      clampContextMenuPosition({
        x: e.clientX,
        y: e.clientY,
        menuWidth: CARD_CONTEXT_MENU_WIDTH,
        menuHeight: CARD_CONTEXT_MENU_HEIGHT,
        gutter: CARD_CONTEXT_MENU_GUTTER,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      }),
    );
  };

  const handleContextMenuDelete = (event: React.MouseEvent<HTMLButtonElement> | React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(null);
    onDelete(item.id);
  };

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
      onContextMenu={handleCardContextMenu}
      className={`group/card absolute flex flex-col overflow-hidden transition-shadow duration-150 focus:outline-none ${getCardChromeClassNames()} ${getCardToneClassNames(item)} ${
        isEditing ? "cursor-default" : isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${getCardRingClass(isSelected)}`}
      style={{
        left: layout.x,
        top: layout.y,
        width: liveSize.width,
        minHeight: liveSize.height,
        zIndex: layout.zIndex || 1,
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`,
        touchAction: isEditing ? "auto" : "none",
      }}
      title={hasBody ? "Double-click to edit card" : "Click to edit card"}
    >
      {!isEditing && (
        <button
          type="button"
          onFocus={handleKeyboardTargetFocus}
          onKeyDown={handleKeyboardTargetKeyDown}
          className="absolute inset-0 z-0"
          aria-label={hasBody ? `Edit card: ${body.slice(0, 60)}` : "Edit card"}
        >
          <span className="sr-only">Select card. Press Enter to edit.</span>
        </button>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.02))] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0))]" />

      <ScratchpadAttachmentGrid
        itemId={item.id}
        attachments={attachments}
        previewMap={previewMap}
        onOpenAttachment={onOpenAttachment}
        onRemoveAttachment={onRemoveAttachment}
      />

      <div className="relative flex-1 px-4 pt-3.5 pb-4">
        {!hasImageAttachment && body.trim() && (
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-current/20 to-transparent" />
        )}
        <ScratchpadCardBody
          body={body}
          isEditing={isEditing}
          textClassName=""
          placeholderClassName="text-stone-500"
          textareaRef={textareaRef}
          onBlur={() => setIsEditing(false)}
          onChange={handleBodyChange}
          onKeyDown={handleTextareaKeyDown}
          onPointerDown={handleTextareaPointerDown}
        />
      </div>

      <div
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerCancel}
        className={getCardResizeHandleClassNames()}
        title="Resize"
      >
        <div className="absolute bottom-2 right-2 h-3 w-3 border-r border-b border-stone-500/25 transition-colors group-hover/card:border-stone-600/45 group-hover:border-stone-700/70 dark:border-stone-300/20 dark:group-hover/card:border-stone-100/40 dark:group-hover:border-stone-100/70" />
      </div>

      {contextMenu &&
        createPortal(
          <div
            ref={contextMenuRef}
            data-scratchpad-ui="true"
            role="menu"
            className="fixed z-[100] w-32 rounded-md border border-stone-200 bg-white p-1.5 shadow-md shadow-stone-900/10 dark:border-stone-800 dark:bg-stone-950 dark:shadow-black/40"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              type="button"
              role="menuitem"
              onPointerDown={handleContextMenuDelete}
              onClick={handleContextMenuDelete}
              className="flex h-8 w-full cursor-default select-none items-center gap-2 rounded-sm px-2 text-left text-sm text-stone-700 outline-none hover:bg-stone-100 hover:text-red-600 focus-visible:bg-stone-100 focus-visible:text-red-600 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-red-300 dark:focus-visible:bg-stone-800 dark:focus-visible:text-red-300"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}

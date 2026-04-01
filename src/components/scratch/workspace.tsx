"use client";

import { type DragEvent, useEffect, useEffectEvent, useRef, useState } from "react";
import {
  beginPointerInteraction,
  cancelPointerInteraction,
  createIdlePointerInteractionState,
  createPointerSession,
  finishPointerInteraction,
  getActivePointerInteraction,
  getPointerSessionDelta,
  hasPointerSessionExceededThreshold,
  type PointerInteractionMap,
  type PointerSession,
} from "@/lib/scratch/interactions";
import type { ScratchpadItem, ScratchpadViewport } from "@/lib/scratch/types";
import {
  DEFAULT_SCRATCHPAD_VIEWPORT,
  panScratchpadViewport,
  SCRATCHPAD_ZOOM_INTENSITY,
  screenPointToCanvasPoint,
  zoomScratchpadViewportAtPoint,
  zoomScratchpadViewportFromCenter,
} from "@/lib/scratch/viewport";
import { CardItem } from "./card-item";

interface WorkspaceProps {
  items: ScratchpadItem[];
  viewport: ScratchpadViewport;
  onViewportChange: (updater: ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport)) => void;
  onUpdateItemBody: (id: string, body: string) => void;
  onUpdateItemLayout: (id: string, updates: Partial<ScratchpadItem>) => void;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
  onCreateTextItem: (x: number, y: number) => void;
  onFileUpload: (files: FileList, x: number, y: number, targetItemId?: string) => void;
  selectedItemIds: string[];
  onSelectItem: (id: string | null, ctrlKey?: boolean) => void;
}

interface PanSession extends PointerSession {
  startViewport: ScratchpadViewport;
  moved: boolean;
}

interface WorkspaceInteractionMap extends PointerInteractionMap {
  panning: PanSession;
}

const PAN_THRESHOLD = 4;

interface BrowserGestureEvent extends Event {
  clientX: number;
  clientY: number;
  scale: number;
}

export function Workspace({
  items,
  viewport,
  onViewportChange,
  onUpdateItemBody,
  onUpdateItemLayout,
  onRemoveAttachment,
  onCreateTextItem,
  onFileUpload,
  selectedItemIds,
  onSelectItem,
}: WorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef(viewport);
  const interactionRef = useRef(createIdlePointerInteractionState<WorkspaceInteractionMap>());
  const suppressClickRef = useRef(false);
  const lastGestureScaleRef = useRef(1);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [lastCanvasPos, setLastCanvasPos] = useState({ x: 320, y: 240 });

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  const updateViewport = (updater: ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport)) => {
    onViewportChange(updater);
  };

  const getDropTargetItemId = (target: EventTarget | null): string | undefined => {
    let element = target as HTMLElement | null;

    while (element && element !== workspaceRef.current) {
      const itemId = element.dataset.scratchpadItemId;
      if (itemId) {
        return itemId;
      }
      element = element.parentElement;
    }

    return undefined;
  };

  const isTargetWithinItem = (target: EventTarget | null): boolean => {
    let element = target as HTMLElement | null;

    while (element && element !== workspaceRef.current) {
      if (element.dataset.scratchpadItem === "true") {
        return true;
      }
      element = element.parentElement;
    }

    return false;
  };

  const isTargetWithinCanvasUi = (target: EventTarget | null): boolean => {
    let element = target as HTMLElement | null;

    while (element && element !== workspaceRef.current) {
      if (element.dataset.scratchpadUi === "true") {
        return true;
      }
      element = element.parentElement;
    }

    return false;
  };

  const getCanvasPoint = (clientX: number, clientY: number, nextViewport = viewportRef.current) => {
    if (!workspaceRef.current) return null;

    const rect = workspaceRef.current.getBoundingClientRect();
    return screenPointToCanvasPoint(clientX, clientY, rect, nextViewport);
  };

  const zoomFromViewportCenter = (factor: number) => {
    if (!workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    updateViewport((current) => zoomScratchpadViewportFromCenter(current, rect, factor));
  };

  const shouldHandleBrowserZoomGesture = useEffectEvent((event: Event) => {
    if (!workspaceRef.current) return false;

    const target = event.target;
    if (!(target instanceof Node) || !workspaceRef.current.contains(target)) {
      return false;
    }

    const path = typeof event.composedPath === "function" ? event.composedPath() : [];

    for (const candidate of path) {
      if (!(candidate instanceof HTMLElement)) {
        continue;
      }

      if (candidate.dataset.scratchpadUi === "true") {
        return false;
      }

      if (
        candidate.tagName === "BUTTON" ||
        candidate.tagName === "INPUT" ||
        candidate.tagName === "SELECT" ||
        candidate.tagName === "TEXTAREA" ||
        candidate.isContentEditable
      ) {
        return false;
      }

      const role = candidate.getAttribute("role");
      if (role === "dialog" || role === "menu" || role === "listbox") {
        return false;
      }
    }

    return true;
  });

  const applyZoomFactorAtPoint = useEffectEvent((clientX: number, clientY: number, zoomFactor: number) => {
    if (!Number.isFinite(zoomFactor) || zoomFactor <= 0) {
      return;
    }

    if (!workspaceRef.current) {
      return;
    }

    const rect = workspaceRef.current.getBoundingClientRect();
    updateViewport((current) =>
      zoomScratchpadViewportAtPoint(current, clientX - rect.left, clientY - rect.top, current.scale * zoomFactor),
    );
  });

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
        e.preventDefault();
        onFileUpload(e.clipboardData.files, lastCanvasPos.x, lastCanvasPos.y);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [lastCanvasPos, onFileUpload]);

  useEffect(() => {
    const workspaceElement = workspaceRef.current;
    if (!workspaceElement) {
      return;
    }

    const handleGestureStart = (event: Event) => {
      const gestureEvent = event as BrowserGestureEvent;
      if (!shouldHandleBrowserZoomGesture(gestureEvent)) {
        return;
      }

      lastGestureScaleRef.current = gestureEvent.scale || 1;
    };

    const handleGestureChange = (event: Event) => {
      const gestureEvent = event as BrowserGestureEvent;
      if (!shouldHandleBrowserZoomGesture(gestureEvent)) {
        return;
      }

      const nextScale = gestureEvent.scale || lastGestureScaleRef.current;
      const zoomFactor = nextScale / lastGestureScaleRef.current;
      lastGestureScaleRef.current = nextScale;

      applyZoomFactorAtPoint(gestureEvent.clientX, gestureEvent.clientY, zoomFactor);
    };

    const handleGestureEnd = () => {
      lastGestureScaleRef.current = 1;
    };

    workspaceElement.addEventListener("gesturestart", handleGestureStart as EventListener, { passive: false });
    workspaceElement.addEventListener("gesturechange", handleGestureChange as EventListener, { passive: false });
    workspaceElement.addEventListener("gestureend", handleGestureEnd, { passive: false });

    return () => {
      workspaceElement.removeEventListener("gesturestart", handleGestureStart as EventListener);
      workspaceElement.removeEventListener("gesturechange", handleGestureChange as EventListener);
      workspaceElement.removeEventListener("gestureend", handleGestureEnd);
    };
  }, []);

  const finishPan = (panSession: PanSession) => {
    suppressClickRef.current = panSession.moved;
    setIsPanning(false);
  };

  const cancelPan = () => {
    setIsPanning(false);
  };

  const handleWorkspacePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.button !== 0 && e.button !== 1) || isTargetWithinItem(e.target) || isTargetWithinCanvasUi(e.target)) {
      return;
    }

    e.preventDefault();
    const point = getCanvasPoint(e.clientX, e.clientY);
    if (point) {
      setLastCanvasPos(point);
    }

    beginPointerInteraction(interactionRef, e.currentTarget, "panning", {
      ...createPointerSession(e.pointerId, e.clientX, e.clientY),
      startViewport: viewportRef.current,
      moved: false,
    });
  };

  const handleWorkspacePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const point = getCanvasPoint(e.clientX, e.clientY);
    if (point) {
      setLastCanvasPos(point);
    }

    const panSession = getActivePointerInteraction(interactionRef, "panning", e.pointerId);
    if (!panSession) {
      return;
    }

    const delta = getPointerSessionDelta(panSession, e.clientX, e.clientY);

    if (!panSession.moved && !hasPointerSessionExceededThreshold(panSession, e.clientX, e.clientY, PAN_THRESHOLD)) {
      return;
    }

    if (!panSession.moved) {
      panSession.moved = true;
      setIsPanning(true);
    }

    updateViewport(panScratchpadViewport(panSession.startViewport, delta.x, delta.y));
  };

  const handleWorkspacePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const panSession = finishPointerInteraction(interactionRef, e.currentTarget, "panning", e.pointerId);
    if (!panSession) {
      return;
    }

    finishPan(panSession);
  };

  const handleWorkspacePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cancelPointerInteraction(interactionRef, "panning", e.pointerId)) {
      return;
    }

    cancelPan();
  };

  const handleWorkspaceClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (isTargetWithinItem(e.target) || isTargetWithinCanvasUi(e.target)) {
      return;
    }

    onSelectItem(null);
  };

  const handleWorkspaceDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTargetWithinItem(e.target) || isTargetWithinCanvasUi(e.target)) {
      return;
    }

    const point = getCanvasPoint(e.clientX, e.clientY);
    if (!point) return;

    onCreateTextItem(point.x, point.y);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      if (!shouldHandleBrowserZoomGesture(e.nativeEvent)) {
        return;
      }

      e.preventDefault();
      const zoomFactor = Math.exp(-e.deltaY * SCRATCHPAD_ZOOM_INTENSITY);
      applyZoomFactorAtPoint(e.clientX, e.clientY, zoomFactor);
      return;
    }

    e.preventDefault();
    updateViewport((current) => panScratchpadViewport(current, -e.deltaX, -e.deltaY));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const point = getCanvasPoint(e.clientX, e.clientY);
      if (!point) return;

      onFileUpload(e.dataTransfer.files, point.x, point.y, getDropTargetItemId(e.target));
    }
  };

  const zoomLabel = `${Math.round(viewport.scale * 100)}%`;
  const gridOffsetX = `${viewport.x}px`;
  const gridOffsetY = `${viewport.y}px`;
  const minorGrid = `${32 * viewport.scale}px`;
  const majorGrid = `${160 * viewport.scale}px`;

  return (
    <div
      ref={workspaceRef}
      onPointerDown={handleWorkspacePointerDown}
      onPointerMove={handleWorkspacePointerMove}
      onPointerUp={handleWorkspacePointerUp}
      onPointerCancel={handleWorkspacePointerCancel}
      onClick={handleWorkspaceClick}
      onDoubleClick={handleWorkspaceDoubleClick}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative h-full w-full overflow-hidden bg-[#ece8dc] dark:bg-[#171411] ${
        isPanning ? "cursor-grabbing" : "cursor-grab"
      } ${isDraggingOver ? "ring-4 ring-teal-400 ring-inset" : ""}`}
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(130,118,94,0.04) 1px, transparent 1px), " +
          "linear-gradient(to bottom, rgba(130,118,94,0.04) 1px, transparent 1px), " +
          "linear-gradient(to right, rgba(112,100,78,0.05) 1px, transparent 1px), " +
          "linear-gradient(to bottom, rgba(112,100,78,0.05) 1px, transparent 1px)",
        backgroundPosition: `${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}, ${gridOffsetX} ${gridOffsetY}`,
        backgroundSize: `${minorGrid} ${minorGrid}, ${minorGrid} ${minorGrid}, ${majorGrid} ${majorGrid}, ${majorGrid} ${majorGrid}`,
      }}
    >
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `translate3d(${viewport.x}px, ${viewport.y}px, 0) scale(${viewport.scale})`,
        }}
      >
        {items.map((item) => (
          <CardItem
            key={item.id}
            item={item}
            canvasScale={viewport.scale}
            onUpdateBody={onUpdateItemBody}
            onUpdateLayout={onUpdateItemLayout}
            onRemoveAttachment={onRemoveAttachment}
            isSelected={selectedItemIds.includes(item.id)}
            onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-white/55 bg-white/68 px-6 py-5 text-center shadow-[0_18px_52px_rgba(107,91,65,0.1)] backdrop-blur-sm">
            <p className="text-lg font-medium text-stone-800">Double-click to create a note</p>
            <p className="mt-2 text-sm leading-6 text-stone-500">Drag to pan. Ctrl or Cmd + wheel to zoom. Paste or drop files anywhere.</p>
          </div>
        </div>
      )}

      {isDraggingOver && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#79a89d]/10">
          <div className="rounded-2xl border border-[#98bdb4] bg-white/92 px-5 py-3 text-center shadow-[0_20px_60px_rgba(79,108,101,0.14)] backdrop-blur">
            <p className="text-lg font-semibold text-[#5a8a83]">Drop files here</p>
            <p className="mt-1 text-sm text-[#6d9a93]/90">They can land on the canvas or attach to an existing card.</p>
          </div>
        </div>
      )}

      <div
        data-scratchpad-ui="true"
        className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/74 p-1.5 shadow-[0_12px_30px_rgba(109,92,68,0.12)] backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={() => zoomFromViewportCenter(1 / 1.15)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-medium text-stone-500 transition hover:bg-stone-100/80"
          title="Zoom out"
        >
          -
        </button>
        <button
          type="button"
          onClick={() => updateViewport(DEFAULT_SCRATCHPAD_VIEWPORT)}
          className="rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500 transition hover:bg-stone-100/80"
          title="Reset view"
        >
          {zoomLabel}
        </button>
        <button
          type="button"
          onClick={() => zoomFromViewportCenter(1.15)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-medium text-stone-500 transition hover:bg-stone-100/80"
          title="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}

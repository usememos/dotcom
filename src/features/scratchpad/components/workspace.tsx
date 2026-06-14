"use client";

import { type DragEvent, useEffect, useEffectEvent, useRef, useState } from "react";
import { findScratchpadItemId, isWithinScratchpadItem, isWithinScratchpadUi } from "@/features/scratchpad/lib/dom-targets";
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
} from "@/features/scratchpad/lib/interactions";
import {
  centerScratchpadViewportOnCanvasPoint,
  DEFAULT_SCRATCHPAD_VIEWPORT,
  panScratchpadViewport,
  SCRATCHPAD_ZOOM_INTENSITY,
  screenPointToCanvasPoint,
  zoomScratchpadViewportAtPoint,
  zoomScratchpadViewportFromCenter,
} from "@/features/scratchpad/lib/viewport";
import {
  formatScratchpadZoomLabel,
  getScratchpadItemCenter,
  getScratchpadWheelZoomFactor,
  isZoomGestureTargetAllowed,
} from "@/features/scratchpad/lib/workspace-geometry";
import { shouldShowZoomControls, ZOOM_CONTROLS_HIDE_DELAY_MS } from "@/features/scratchpad/lib/zoom-visibility";
import type { ScratchpadAttachmentRef, ScratchpadItem, ScratchpadItemLayout, ScratchpadViewport } from "@/features/scratchpad/types";
import { CardItem } from "./card-item";
import { ScratchpadAttachmentViewer } from "./scratchpad-attachment-viewer";
import { ScratchpadCanvasBackground } from "./scratchpad-canvas-background";
import { ScratchpadDropOverlay } from "./scratchpad-drop-overlay";
import { ScratchpadEmptyState } from "./scratchpad-empty-state";
import { ScratchpadZoomControls } from "./scratchpad-zoom-controls";

interface WorkspaceProps {
  items: ScratchpadItem[];
  viewport: ScratchpadViewport;
  onViewportChange: (updater: ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport)) => void;
  onUpdateItemBody: (id: string, body: string) => void;
  onUpdateItemLayout: (id: string, updates: Partial<ScratchpadItemLayout>) => void;
  onDeleteItem: (id: string) => void;
  onRemoveAttachment: (id: string, attachmentId: string) => void;
  onCreateTextItem: (x: number, y: number) => void;
  onFileUpload: (files: FileList, x: number, y: number, targetItemId?: string) => void;
  selectedItemIds: string[];
  lastActiveItemId: string | null;
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
const SCRATCHPAD_BUTTON_ZOOM_FACTOR = 1.15;

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
  onDeleteItem,
  onRemoveAttachment,
  onCreateTextItem,
  onFileUpload,
  selectedItemIds,
  lastActiveItemId,
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
  const [zoomControlsHovered, setZoomControlsHovered] = useState(false);
  const [zoomControlsFocused, setZoomControlsFocused] = useState(false);
  const [lastZoomInteractionAt, setLastZoomInteractionAt] = useState<number | null>(null);
  const [zoomVisibilityClock, setZoomVisibilityClock] = useState(() => Date.now());
  const [openAttachment, setOpenAttachment] = useState<ScratchpadAttachmentRef | null>(null);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  const updateViewport = (updater: ScratchpadViewport | ((current: ScratchpadViewport) => ScratchpadViewport)) => {
    onViewportChange(updater);
  };

  const revealZoomControls = () => {
    const now = Date.now();
    setLastZoomInteractionAt(now);
    setZoomVisibilityClock(now);
  };

  useEffect(() => {
    if (lastZoomInteractionAt === null || zoomControlsHovered || zoomControlsFocused) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setZoomVisibilityClock(Date.now());
    }, ZOOM_CONTROLS_HIDE_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [lastZoomInteractionAt, zoomControlsFocused, zoomControlsHovered]);

  const getCanvasPoint = (clientX: number, clientY: number, nextViewport = viewportRef.current) => {
    if (!workspaceRef.current) return null;

    const rect = workspaceRef.current.getBoundingClientRect();
    return screenPointToCanvasPoint(clientX, clientY, rect, nextViewport);
  };

  const zoomFromViewportCenter = (factor: number) => {
    if (!workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    revealZoomControls();
    updateViewport((current) => zoomScratchpadViewportFromCenter(current, rect, factor));
  };

  const getLastActiveItemCenter = () => {
    const lastActiveItem = lastActiveItemId ? items.find((item) => item.id === lastActiveItemId) : null;
    return lastActiveItem ? getScratchpadItemCenter(lastActiveItem) : null;
  };

  const centerViewportTowardLastActiveItem = (getNextScale: (current: ScratchpadViewport) => number, fallback: (rect: DOMRect) => void) => {
    if (!workspaceRef.current) return;

    const rect = workspaceRef.current.getBoundingClientRect();
    const itemCenter = getLastActiveItemCenter();

    revealZoomControls();
    if (!itemCenter) {
      fallback(rect);
      return;
    }

    updateViewport((current) => centerScratchpadViewportOnCanvasPoint(rect, itemCenter, getNextScale(current)));
  };

  const zoomInTowardLastActiveItem = () =>
    centerViewportTowardLastActiveItem(
      (current) => current.scale * SCRATCHPAD_BUTTON_ZOOM_FACTOR,
      (rect) => updateViewport((current) => zoomScratchpadViewportFromCenter(current, rect, SCRATCHPAD_BUTTON_ZOOM_FACTOR)),
    );

  const resetViewportTowardLastActiveItem = () =>
    centerViewportTowardLastActiveItem(
      () => DEFAULT_SCRATCHPAD_VIEWPORT.scale,
      () => updateViewport(DEFAULT_SCRATCHPAD_VIEWPORT),
    );

  const shouldHandleBrowserZoomGesture = useEffectEvent((event: Event) => {
    if (!workspaceRef.current) return false;

    const target = event.target;
    if (!(target instanceof Node) || !workspaceRef.current.contains(target)) {
      return false;
    }

    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    return isZoomGestureTargetAllowed(path);
  });

  const applyZoomFactorAtPoint = useEffectEvent((clientX: number, clientY: number, zoomFactor: number) => {
    if (!Number.isFinite(zoomFactor) || zoomFactor <= 0) {
      return;
    }

    if (!workspaceRef.current) {
      return;
    }

    const rect = workspaceRef.current.getBoundingClientRect();
    revealZoomControls();
    updateViewport((current) =>
      zoomScratchpadViewportAtPoint(current, clientX - rect.left, clientY - rect.top, current.scale * zoomFactor),
    );
  });

  const handleWheel = useEffectEvent((event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      if (!shouldHandleBrowserZoomGesture(event)) {
        return;
      }

      event.preventDefault();
      const zoomFactor = getScratchpadWheelZoomFactor(event.deltaY, SCRATCHPAD_ZOOM_INTENSITY);
      applyZoomFactorAtPoint(event.clientX, event.clientY, zoomFactor);
      return;
    }

    event.preventDefault();
    revealZoomControls();
    updateViewport((current) => panScratchpadViewport(current, -event.deltaX, -event.deltaY));
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
    workspaceElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      workspaceElement.removeEventListener("gesturestart", handleGestureStart as EventListener);
      workspaceElement.removeEventListener("gesturechange", handleGestureChange as EventListener);
      workspaceElement.removeEventListener("gestureend", handleGestureEnd);
      workspaceElement.removeEventListener("wheel", handleWheel);
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
    if (
      (e.button !== 0 && e.button !== 1) ||
      isWithinScratchpadItem(e.target, workspaceRef.current) ||
      isWithinScratchpadUi(e.target, workspaceRef.current)
    ) {
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

    revealZoomControls();
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

    if (isWithinScratchpadItem(e.target, workspaceRef.current) || isWithinScratchpadUi(e.target, workspaceRef.current)) {
      return;
    }

    onSelectItem(null);
  };

  const handleWorkspaceDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWithinScratchpadItem(e.target, workspaceRef.current) || isWithinScratchpadUi(e.target, workspaceRef.current)) {
      return;
    }

    const point = getCanvasPoint(e.clientX, e.clientY);
    if (!point) return;

    onCreateTextItem(point.x, point.y);
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

      onFileUpload(e.dataTransfer.files, point.x, point.y, findScratchpadItemId(e.target, workspaceRef.current));
    }
  };

  const zoomLabel = formatScratchpadZoomLabel(viewport.scale);
  const zoomControlsVisible = shouldShowZoomControls({
    hovered: zoomControlsHovered,
    focused: zoomControlsFocused,
    lastInteractionAt: lastZoomInteractionAt,
    now: zoomVisibilityClock,
  });

  return (
    <div
      ref={workspaceRef}
      onPointerDown={handleWorkspacePointerDown}
      onPointerMove={handleWorkspacePointerMove}
      onPointerUp={handleWorkspacePointerUp}
      onPointerCancel={handleWorkspacePointerCancel}
      onClick={handleWorkspaceClick}
      onDoubleClick={handleWorkspaceDoubleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative h-full w-full overflow-hidden ${
        isPanning ? "cursor-grabbing" : "cursor-grab"
      } ${isDraggingOver ? "ring-4 ring-teal-400 ring-inset" : ""}`}
    >
      <ScratchpadCanvasBackground viewport={viewport} />

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
            onDelete={onDeleteItem}
            onRemoveAttachment={onRemoveAttachment}
            onOpenAttachment={setOpenAttachment}
            isSelected={selectedItemIds.includes(item.id)}
            onSelect={(ctrlKey) => onSelectItem(item.id, ctrlKey)}
          />
        ))}
      </div>

      {items.length === 0 && <ScratchpadEmptyState />}

      {isDraggingOver && <ScratchpadDropOverlay />}

      <ScratchpadZoomControls
        zoomLabel={zoomLabel}
        visible={zoomControlsVisible}
        onHoverChange={setZoomControlsHovered}
        onFocusChange={setZoomControlsFocused}
        onZoomOut={() => zoomFromViewportCenter(1 / SCRATCHPAD_BUTTON_ZOOM_FACTOR)}
        onReset={resetViewportTowardLastActiveItem}
        onZoomIn={zoomInTowardLastActiveItem}
      />

      <ScratchpadAttachmentViewer attachment={openAttachment} onClose={() => setOpenAttachment(null)} />
    </div>
  );
}

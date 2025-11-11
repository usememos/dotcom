import { useEffect, useRef, useState, RefObject } from 'react';

interface DragOptions {
  onDragStart?: (e: MouseEvent | TouchEvent) => void;
  onDrag?: (delta: { x: number; y: number }, event: MouseEvent | TouchEvent) => void;
  onDragEnd?: () => void;
  enabled?: boolean;
}

interface DragState {
  isDragging: boolean;
}

/**
 * Custom React hook for drag functionality
 * Supports both mouse and touch events with proper cleanup
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const { isDragging } = useDraggable(ref, {
 *   onDrag: (delta) => {
 *     setPosition(pos => ({ x: pos.x + delta.x, y: pos.y + delta.y }));
 *   }
 * });
 */
export function useDraggable(
  ref: RefObject<HTMLElement>,
  options: DragOptions
): DragState {
  const { onDragStart, onDrag, onDragEnd, enabled = true } = options;
  const [isDragging, setIsDragging] = useState(false);

  // Use refs to avoid recreating event handlers
  const lastPosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const dragStateRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;

    // Helper to get position from mouse or touch event
    const getEventPosition = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        return { x: e.touches[0].pageX, y: e.touches[0].pageY };
      }
      return { x: e.pageX, y: e.pageY };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      // Don't start drag on form elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      e.preventDefault();

      const pos = getEventPosition(e);
      lastPosRef.current = pos;
      setIsDragging(true);

      if (onDragStart) {
        onDragStart(e);
      }

      // Mouse/Touch move handler
      const handleMove = (e: MouseEvent | TouchEvent) => {
        const currentPos = getEventPosition(e);
        const delta = {
          x: currentPos.x - lastPosRef.current.x,
          y: currentPos.y - lastPosRef.current.y,
        };

        // Store delta for RAF
        dragStateRef.current = delta;

        // Use RAF to throttle updates for smooth performance
        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            if (dragStateRef.current && onDrag) {
              onDrag(dragStateRef.current, e);
            }
            rafIdRef.current = null;
          });
        }

        lastPosRef.current = currentPos;
      };

      // Mouse/Touch end handler
      const handleEnd = () => {
        // Cancel pending RAF
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }

        // Final update if there's pending state
        if (dragStateRef.current && onDrag) {
          onDrag(dragStateRef.current, new MouseEvent('mouseup'));
        }

        dragStateRef.current = null;
        setIsDragging(false);

        if (onDragEnd) {
          onDragEnd();
        }

        // Clean up listeners
        window.removeEventListener('mousemove', handleMove as EventListener);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove as EventListener);
        window.removeEventListener('touchend', handleEnd);
      };

      // Attach window-level listeners for better tracking
      window.addEventListener('mousemove', handleMove as EventListener);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove as EventListener);
      window.addEventListener('touchend', handleEnd);
    };

    // Attach start listeners to element
    element.addEventListener('mousedown', handleStart as EventListener);
    element.addEventListener('touchstart', handleStart as EventListener, { passive: false });

    // Cleanup on unmount
    return () => {
      element.removeEventListener('mousedown', handleStart as EventListener);
      element.removeEventListener('touchstart', handleStart as EventListener);

      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, onDragStart, onDrag, onDragEnd, ref]);

  return { isDragging };
}

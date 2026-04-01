"use client";

import { useEffect } from "react";

const SCRATCHPAD_VIEWPORT_CONTENT = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";

export function ScratchpadViewportLock() {
  useEffect(() => {
    const head = document.head;
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    const previousContent = viewportMeta?.getAttribute("content") ?? null;

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
    };

    const handleGesture = (event: Event) => {
      event.preventDefault();
    };

    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.setAttribute("name", "viewport");
      head.appendChild(viewportMeta);
    }

    viewportMeta.setAttribute("content", SCRATCHPAD_VIEWPORT_CONTENT);
    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    window.addEventListener("gesturestart", handleGesture, { capture: true, passive: false });
    window.addEventListener("gesturechange", handleGesture, { capture: true, passive: false });
    window.addEventListener("gestureend", handleGesture, { capture: true, passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel, true);
      window.removeEventListener("gesturestart", handleGesture, true);
      window.removeEventListener("gesturechange", handleGesture, true);
      window.removeEventListener("gestureend", handleGesture, true);

      if (!viewportMeta) return;

      if (previousContent === null) {
        viewportMeta.remove();
        return;
      }

      viewportMeta.setAttribute("content", previousContent);
    };
  }, []);

  return null;
}

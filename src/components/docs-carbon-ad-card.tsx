"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SPONSOR_CTA = {
  label: "Become a Sponsor",
  url: "https://github.com/sponsors/usememos",
};

const CARBON_SCRIPT_SRC = "https://cdn.carbonads.com/carbon.js?serve=CWBD4K7E&placement=usememoscom&format=cover";
const CARBON_SCRIPT_ID = "_carbonads_js";

export function DocsCarbonAdCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let isMounted = true;

    const markLoaded = () => {
      if (!isMounted) {
        return;
      }
      setStatus("loaded");
    };

    const markFailed = () => {
      if (!isMounted) {
        return;
      }
      setStatus((prev) => (prev === "loaded" ? prev : "failed"));
    };

    const observer = new MutationObserver(() => {
      if (container.querySelector("#carbonads")) {
        markLoaded();
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    let cleanupScriptListeners: (() => void) | undefined;
    const handleScriptLoad = () => {
      if (container.querySelector("#carbonads")) {
        markLoaded();
      }
    };
    const handleScriptError = () => {
      markFailed();
    };

    const existingAd = document.getElementById("carbonads");
    if (existingAd) {
      container.appendChild(existingAd);
      markLoaded();
    } else {
      const existingScript = document.getElementById(CARBON_SCRIPT_ID) as HTMLScriptElement | null;
      if (existingScript) {
        existingScript.addEventListener("load", handleScriptLoad);
        existingScript.addEventListener("error", handleScriptError);
        cleanupScriptListeners = () => {
          existingScript.removeEventListener("load", handleScriptLoad);
          existingScript.removeEventListener("error", handleScriptError);
        };
      } else {
        const script = document.createElement("script");
        script.src = CARBON_SCRIPT_SRC;
        script.async = true;
        script.id = CARBON_SCRIPT_ID;
        script.type = "text/javascript";
        script.addEventListener("load", handleScriptLoad);
        script.addEventListener("error", handleScriptError);
        container.appendChild(script);

        cleanupScriptListeners = () => {
          script.removeEventListener("load", handleScriptLoad);
          script.removeEventListener("error", handleScriptError);
        };
      }
    }

    const timeoutId = window.setTimeout(() => {
      if (container.querySelector("#carbonads")) {
        markLoaded();
      } else {
        markFailed();
      }
    }, 3000);

    return () => {
      isMounted = false;
      observer.disconnect();
      window.clearTimeout(timeoutId);
      cleanupScriptListeners?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-h-80 rounded-xl border border-border bg-muted/30 p-3 shadow-sm transition overflow-auto",
        "dark:bg-muted/10"
      )}
      aria-label="Sponsored by Carbon"
    >
      <span className="sr-only">Carbon Ads</span>
      {status === "loading" ? (
        <div className="flex w-full items-center justify-center px-3 py-1 text-sm text-muted-foreground" aria-hidden="true">
          Loading…
        </div>
      ) : null}
      {status === "failed" ? (
        <a
          href={SPONSOR_CTA.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center px-3 py-1 text-sm font-semibold text-muted-foreground transition hover:opacity-80"
        >
          {SPONSOR_CTA.label}
        </a>
      ) : null}
    </div>
  );
}

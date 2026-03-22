"use client";

import { useReducedMotion } from "framer-motion";
import { MemoHeroReading } from "@/components/memo-hero-reading";
import { MemoHeroRelease } from "@/components/memo-hero-release";
import { MemoHeroTravel } from "@/components/memo-hero-travel";

function MemoHeroColumn() {
  return (
    <>
      <MemoHeroTravel />
      <MemoHeroRelease />
      <MemoHeroReading />
    </>
  );
}

export function MemoHeroMock() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative h-full w-full overflow-hidden px-1 pt-2 sm:px-2 sm:pt-3">
      <div className="relative mx-auto h-full max-w-xl overflow-hidden">
        {shouldReduceMotion ? (
          <div className="flex flex-col gap-3">
            <MemoHeroColumn />
          </div>
        ) : (
          <div className="memo-hero-scroll-track flex flex-col gap-3">
            <MemoHeroColumn />
            <MemoHeroColumn />
          </div>
        )}
      </div>

      <style jsx>{`
        .memo-hero-scroll-track {
          animation: memo-hero-scroll 24s linear infinite;
        }

        @keyframes memo-hero-scroll {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(-50% - 0.375rem));
          }
        }
      `}</style>
    </div>
  );
}

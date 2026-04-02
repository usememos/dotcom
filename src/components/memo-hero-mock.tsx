"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MemoHeroBookmarks } from "@/components/memo-hero-bookmarks";
import { MemoHeroCapture } from "@/components/memo-hero-capture";
import { MemoHeroDaily } from "@/components/memo-hero-daily";
import { MemoHeroDeploy } from "@/components/memo-hero-deploy";
import { MemoHeroJournal } from "@/components/memo-hero-journal";

const MEMO_COUNT = 5;
const ROTATION_INTERVAL = 5000;

function formatMemoDate(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${month} ${day}, ${year} · ${time}`;
}

function generateRandomDates(): string[] {
  const now = Date.now();
  const randomOffset = () => Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
  return Array.from({ length: MEMO_COUNT }, () => formatMemoDate(new Date(now - randomOffset())));
}

export function MemoHeroMock() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [dates, setDates] = useState<string[]>(() => Array.from({ length: MEMO_COUNT }, () => ""));
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    setDates(generateRandomDates());
  }, []);

  const advance = useCallback(() => {
    setActiveIndex((prev) => {
      setPrevIndex(prev);
      return (prev + 1) % MEMO_COUNT;
    });
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, ROTATION_INTERVAL);
  }, [advance]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleDotClick = (index: number) => {
    setPrevIndex(activeIndex);
    setActiveIndex(index);
    startTimer();
  };

  const memos = [
    <MemoHeroCapture key="capture" date={dates[0]} />,
    <MemoHeroDeploy key="deploy" date={dates[1]} />,
    <MemoHeroDaily key="daily" date={dates[2]} />,
    <MemoHeroBookmarks key="bookmarks" date={dates[3]} />,
    <MemoHeroJournal key="journal" date={dates[4]} />,
  ];

  return (
    <div className="relative w-full">
      <div className="relative min-h-[29rem]">
        <div className="absolute inset-x-0 top-0 bottom-0 grid [&>*]:col-start-1 [&>*]:row-start-1">
          {memos.map((memo, i) => {
            const isActive = i === activeIndex;
            const isLeaving = i === prevIndex;

            return (
              <div
                key={i}
                className="h-full transition-all duration-700 ease-in-out"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? "translateX(0)" : isLeaving ? "translateX(-24px)" : "translateX(24px)",
                  zIndex: isActive ? 2 : isLeaving ? 1 : 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                {memo}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-stone-300/55 px-5 pt-4 dark:border-white/8 sm:px-6">
        <span className="text-xs font-medium tracking-[0.16em] text-stone-400 uppercase dark:text-stone-500">Your notes, your way</span>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium tabular-nums text-stone-500 dark:text-stone-400">
            {String(activeIndex + 1).padStart(2, "0")} / {String(MEMO_COUNT).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: MEMO_COUNT }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleDotClick(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex ? "w-6 bg-stone-700 dark:bg-stone-300" : "w-1.5 bg-stone-300 dark:bg-stone-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

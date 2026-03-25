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
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        {memos.map((memo, i) => {
          const isActive = i === activeIndex;
          const isLeaving = i === prevIndex;

          return (
            <div
              key={i}
              className="transition-all duration-700 ease-in-out"
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

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-slate-500">Your notes, your way</span>
        <div className="flex gap-2">
          {Array.from({ length: MEMO_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? "w-6 bg-teal-600 dark:bg-teal-400" : "w-1.5 bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

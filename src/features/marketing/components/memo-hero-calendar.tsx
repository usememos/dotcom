"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { buildHomeCalendar } from "@/features/marketing/data/home-memos";

export function MemoHeroCalendar() {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const now = new Date();
      setToday(now);
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(update, midnight.getTime() - now.getTime());
    };
    update();
    return () => clearTimeout(timer);
  }, []);

  // The public page stays static; only this calendar reads the visitor's clock.
  const calendar = today ? buildHomeCalendar(today) : null;
  return (
    <section data-testid="mock-calendar">
      <div className="mb-2 flex h-[22px] items-center justify-between px-1.5">
        <p className="text-[10.5px] font-medium text-[var(--mock-ink)]">{calendar?.label ?? "Calendar"}</p>
        <div className="flex gap-1.5 text-[var(--mock-muted)] opacity-70">
          <ChevronLeftIcon className="size-3" />
          <ChevronRightIcon className="size-3" />
        </div>
      </div>
      <div className="mb-1.5 grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <span key={`${day}-${index}`} className="flex h-3.5 items-center justify-center text-[8px] text-[var(--mock-muted)] opacity-60">
            {day}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendar ? (
          calendar.days.map((day) => (
            <span
              key={day.key}
              data-date={day.key}
              aria-current={day.today ? "date" : undefined}
              className={`relative flex aspect-square items-center justify-center rounded-[6px] text-[9px] tabular-nums ${
                day.outside
                  ? "text-[var(--mock-muted)] opacity-25"
                  : day.count
                    ? "bg-[color-mix(in_oklab,var(--mock-accent)_22%,transparent)] text-[var(--mock-ink)]"
                    : "text-[var(--mock-muted)]"
              }`}
            >
              {day.label}
              {day.today ? (
                <span className="absolute bottom-[2px] left-1/2 size-[2.5px] -translate-x-1/2 rounded-full bg-[var(--mock-accent)]" />
              ) : null}
            </span>
          ))
        ) : (
          <div className="col-span-7 h-[8.5rem]" />
        )}
      </div>
    </section>
  );
}

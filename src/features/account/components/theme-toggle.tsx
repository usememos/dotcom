"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] as const;

const buttonBaseClassName = "flex h-6 w-6 items-center justify-center rounded transition";
const activeButtonClassName = "bg-stone-900 text-white dark:bg-white dark:text-stone-900";
const inactiveButtonClassName =
  "text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100";

/**
 * Compact theme switcher: a single row of icon actions (light/dark/system).
 * Plain buttons keep the dropdown open while toggling for a live preview.
 * Render at the bottom of a Radix DropdownMenu.Content.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid a hydration mismatch: the resolved theme is unknown on the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted ? theme : "system";

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <span className="text-xs font-medium text-stone-500 dark:text-stone-500">Theme</span>
      <div className="flex items-center gap-0.5 rounded-md border border-stone-200 p-0.5 dark:border-stone-800">
        {THEMES.map(({ value, label, Icon }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={isActive}
              title={label}
              onClick={() => setTheme(value)}
              className={`${buttonBaseClassName} ${isActive ? activeButtonClassName : inactiveButtonClassName}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

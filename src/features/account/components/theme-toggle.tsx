"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";

const THEMES = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] as const;

/**
 * Compact theme switcher: a single row of icon actions (light/dark/system).
 * Plain buttons keep the dropdown open while toggling for a live preview.
 * Render at the bottom of a DropdownMenuContent.
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
    <div className="flex items-center justify-between gap-4 px-1.5 py-1">
      <span className="text-xs font-medium text-muted-foreground">Theme</span>
      <div className="flex items-center gap-0.5">
        {THEMES.map(({ value, label, Icon }) => {
          const isActive = active === value;
          return (
            <Button
              key={value}
              type="button"
              variant={isActive ? "secondary" : "ghost"}
              size="icon-sm"
              aria-label={label}
              aria-pressed={isActive}
              title={label}
              onClick={() => setTheme(value)}
            >
              <Icon />
            </Button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { menuLabelClassName, menuRadioItemClassName } from "../lib/menu-styles";

const THEMES = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] as const;

/** Theme (light/dark/system) radio group. Render inside a Radix DropdownMenu.Content. */
export function ThemeMenuItems() {
  const { theme, setTheme } = useTheme();
  // Avoid a hydration mismatch: the resolved theme is unknown on the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <DropdownMenu.Label className={menuLabelClassName}>Theme</DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={mounted ? theme : "system"} onValueChange={setTheme}>
        {THEMES.map(({ value, label, Icon }) => (
          <DropdownMenu.RadioItem key={value} className={menuRadioItemClassName} value={value}>
            <DropdownMenu.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              <CheckIcon className="h-3.5 w-3.5" />
            </DropdownMenu.ItemIndicator>
            <Icon className="h-4 w-4 text-stone-500 dark:text-stone-400" />
            <span>{label}</span>
          </DropdownMenu.RadioItem>
        ))}
      </DropdownMenu.RadioGroup>
    </>
  );
}

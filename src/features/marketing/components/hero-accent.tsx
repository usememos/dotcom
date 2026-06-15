import type { ReactNode } from "react";

export function HeroAccent({ children }: { children: ReactNode }) {
  return <span className="text-teal-600 dark:text-teal-300">{children}</span>;
}

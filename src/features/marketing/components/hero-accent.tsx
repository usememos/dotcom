import type { ReactNode } from "react";

export function HeroAccent({ children }: { children: ReactNode }) {
  return <span className="text-brand-600 dark:text-brand-300">{children}</span>;
}

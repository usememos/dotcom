import { type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: ReactNode;
  description: string;
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-12 text-center sm:mb-16">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600 dark:from-teal-900/30 dark:to-cyan-900/30 dark:text-teal-400 sm:h-16 sm:w-16">
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>
      <h2 className="mb-4 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mx-auto max-w-2xl px-4 text-base text-slate-600 dark:text-slate-400 sm:text-lg">{description}</p>
    </div>
  );
}

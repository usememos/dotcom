import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
}

export function SectionHeader({ icon: Icon, title, description, align = "center" }: SectionHeaderProps) {
  const isLeft = align === "left";

  return (
    <div className={`mb-10 ${isLeft ? "max-w-2xl text-left sm:mb-12" : "mx-auto max-w-3xl text-center sm:mb-16"}`}>
      <div
        className={`mb-5 inline-flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200 ${
          isLeft ? "" : "justify-center"
        }`}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <Icon className="h-4 w-4" />
        </span>
        <span className="tracking-[0.12em] uppercase text-slate-500 dark:text-slate-400">Overview</span>
      </div>
      <h2 className="mb-4 text-balance font-serif text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className={`${isLeft ? "" : "mx-auto"} max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg`}>
        {description}
      </p>
    </div>
  );
}

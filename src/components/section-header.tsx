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
        className={`mb-5 inline-flex items-center gap-3 text-sm font-medium text-stone-600 dark:text-stone-300 ${
          isLeft ? "" : "justify-center"
        }`}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center text-stone-600 dark:text-stone-300">
          <Icon className="h-4 w-4 stroke-[1.8]" />
        </span>
        <span className="tracking-[0.18em] uppercase text-stone-500 dark:text-stone-400">Overview</span>
      </div>
      <h2 className="mb-4 text-balance font-serif text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-stone-900 dark:text-stone-100 sm:text-4xl lg:text-[3.15rem]">
        {title}
      </h2>
      <p className={`${isLeft ? "" : "mx-auto"} max-w-2xl text-balance text-base leading-7 text-stone-600 dark:text-stone-400 sm:text-lg`}>
        {description}
      </p>
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: ReactNode;
  description: string;
  align?: "left" | "center";
  eyebrow?: string;
}

export function SectionHeader({ icon: Icon, title, description, align = "center", eyebrow = "Overview" }: SectionHeaderProps) {
  const isLeft = align === "left";

  return (
    <div className={`mb-10 ${isLeft ? "max-w-2xl text-left sm:mb-12" : "mx-auto max-w-3xl text-center sm:mb-16"}`}>
      <div
        className={`mb-5 inline-flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 ${
          isLeft ? "" : "justify-center"
        }`}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center text-zinc-500 dark:text-zinc-400">
          <Icon className="h-4 w-4 stroke-[1.8]" />
        </span>
        <span className="tracking-[0.18em] uppercase text-zinc-500 dark:text-zinc-400">{eyebrow}</span>
      </div>
      <h2 className="mb-4 text-balance font-serif text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-950 dark:text-zinc-100 sm:text-4xl lg:text-[3.15rem]">
        {title}
      </h2>
      <p className={`${isLeft ? "" : "mx-auto"} max-w-2xl text-balance text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg`}>
        {description}
      </p>
    </div>
  );
}

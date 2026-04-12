import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div
      className={`group rounded-lg bg-zinc-50 p-5 transition-colors hover:bg-zinc-100 dark:bg-white/5 dark:hover:bg-white/8 ${className}`}
    >
      <div className="flex max-w-sm flex-col gap-4">
        <div className="inline-flex h-10 w-10 items-center justify-center text-zinc-700 transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-zinc-200">
          {icon}
        </div>
        <div>
          <h3 className="text-balance text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-[1.35rem]">{title}</h3>
          <p className="mt-2 text-balance text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">{description}</p>
        </div>
      </div>
    </div>
  );
}

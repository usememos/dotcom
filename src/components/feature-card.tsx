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
      className={`group min-h-44 rounded-lg border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5 ${className}`}
    >
      <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
        <div className="inline-flex h-5 w-5 items-center justify-center transition-transform duration-300 group-hover:-translate-y-0.5">
          {icon}
        </div>
      </div>
      <h3 className="mt-6 text-balance text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-xl">{title}</h3>
      <p className="mt-3 max-w-[28rem] text-balance text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-[0.98rem]">{description}</p>
    </div>
  );
}

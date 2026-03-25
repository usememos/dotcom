import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`group relative border-t border-slate-200/80 pt-5 dark:border-white/10 sm:pt-6 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-teal-500 via-cyan-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
      <div className="flex max-w-sm flex-col gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-900 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] transition-transform duration-300 group-hover:-translate-y-1 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:shadow-none">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-[1.35rem]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
        </div>
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`group relative border-t border-stone-300/70 pt-5 dark:border-white/10 sm:pt-6 ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-stone-500/65 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
      <div className="flex max-w-sm flex-col gap-4">
        <div className="inline-flex h-10 w-10 items-center justify-center text-stone-700 transition-transform duration-300 group-hover:-translate-y-0.5 dark:text-stone-200">
          {icon}
        </div>
        <div>
          <h3 className="text-balance text-lg font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-[1.35rem]">
            {title}
          </h3>
          <p className="mt-2 text-balance text-sm leading-7 text-stone-600 dark:text-stone-300 sm:text-base">{description}</p>
        </div>
      </div>
    </div>
  );
}

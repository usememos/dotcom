import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ icon, value, label, className = "" }: StatsCardProps) {
  return (
    <div className={`border-t border-stone-300/65 pt-5 text-left dark:border-white/10 sm:pt-6 ${className}`}>
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center text-stone-700 dark:text-stone-200 sm:h-11 sm:w-11">
        {icon}
      </div>
      <div className="mb-1 text-2xl font-semibold tracking-tight text-stone-950 dark:text-stone-100 sm:text-[1.9rem]">{value}</div>
      <div className="text-sm font-medium text-stone-600 dark:text-stone-300">{label}</div>
    </div>
  );
}

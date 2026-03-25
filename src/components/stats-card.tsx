import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ icon, value, label, className = "" }: StatsCardProps) {
  return (
    <div className={`border-t border-white/50 pt-5 text-left dark:border-white/10 sm:pt-6 ${className}`}>
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 bg-white/70 text-teal-700 shadow-[0_16px_30px_-24px_rgba(8,145,178,0.7)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-teal-300 dark:shadow-none sm:h-12 sm:w-12">
        {icon}
      </div>
      <div className="mb-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[1.9rem]">{value}</div>
      <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</div>
    </div>
  );
}

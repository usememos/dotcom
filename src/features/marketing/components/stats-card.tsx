import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ icon, value, label, className = "" }: StatsCardProps) {
  return (
    <div className={`rounded-lg bg-zinc-50 p-5 text-left dark:bg-white/5 ${className}`}>
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center text-zinc-700 dark:text-zinc-200 sm:h-11 sm:w-11">{icon}</div>
      <div className="mb-1 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-[1.9rem]">{value}</div>
      <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">{label}</div>
    </div>
  );
}

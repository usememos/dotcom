import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ icon, value, label, className = "" }: StatsCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/60 dark:bg-gray-600/60 text-teal-600 dark:text-teal-400 rounded-2xl mb-3 backdrop-blur-sm">
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{label}</div>
    </div>
  );
}

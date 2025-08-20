interface StatsCardProps {
  icon: string;
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ icon, value, label, className = "" }: StatsCardProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-3xl sm:text-4xl">{icon}</span>
      <div>
        <div className="text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{label}</div>
      </div>
    </div>
  );
}

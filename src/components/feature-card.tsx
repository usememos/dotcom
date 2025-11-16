import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`group ${className}`}>
      <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 text-teal-600 dark:text-teal-400 rounded-lg sm:rounded-xl mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 tracking-tight">{title}</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

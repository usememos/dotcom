import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <div className={`group ${className}`}>
      <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm">
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
            {icon}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 tracking-tight">{title}</h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

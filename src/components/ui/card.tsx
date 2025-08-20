import Link from "next/link";
import { ReactNode } from "react";

interface CardsProps {
  children: ReactNode;
}

interface CardProps {
  title: string;
  href: string;
  icon?: string;
  children?: ReactNode;
}

export function Cards({ children }: CardsProps) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">{children}</div>;
}

export function Card({ title, href, icon, children }: CardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 hover:shadow-sm no-underline"
    >
      <div className="flex items-start space-x-3">
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 text-blue-600 group-hover:text-blue-700">
            {/* Icon placeholder - could be enhanced with an icon library */}
            <div className="w-6 h-6 bg-blue-100 rounded" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">{title}</h3>
          {children && <div className="text-gray-600 text-sm leading-relaxed">{children}</div>}
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { ReactNode } from "react";
import {
  Play,
  FileText,
  Keyboard,
  Tag,
  BookOpen,
  Settings,
  Users,
  Code,
  Search,
  Share,
  Download,
  Lightbulb,
  Star,
  ArrowRight,
  ArrowUp,
  Key,
  Lock,
  Shield,
  Container,
  Database,
  HardDrive,
  Cloud,
  ExternalLink,
  Network,
  MessageCircle,
  Zap,
  Activity,
  Cookie,
  Webhook,
  LucideIcon,
} from "lucide-react";

// Icon mapping for string-based icon names
const iconMap: Record<string, LucideIcon> = {
  Play,
  FileText,
  Keyboard,
  Tag,
  BookOpen,
  Settings,
  Users,
  Code,
  Search,
  Share,
  Download,
  Lightbulb,
  Star,
  ArrowRight,
  ArrowUp,
  Key,
  Lock,
  Shield,
  Container,
  Database,
  HardDrive,
  Cloud,
  ExternalLink,
  Network,
  MessageCircle,
  Zap,
  Activity,
  Cookie,
  Webhook,
};

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
  // Get the icon component from the icon map
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <Link
      href={href}
      className="group block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 hover:shadow-sm no-underline"
    >
      <div className="flex items-start space-x-3">
        {IconComponent && (
          <div className="flex-shrink-0 w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
            <IconComponent className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-lg mt-0 font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
            {title}
          </p>
          {children && <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{children}</div>}
        </div>
      </div>
    </Link>
  );
}

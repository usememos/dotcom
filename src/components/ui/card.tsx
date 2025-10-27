import Link from "next/link";
import { ReactNode } from "react";
import {
  PlayIcon,
  FileTextIcon,
  KeyboardIcon,
  TagIcon,
  BookOpenIcon,
  SettingsIcon,
  UsersIcon,
  CodeIcon,
  SearchIcon,
  ShareIcon,
  DownloadIcon,
  LightbulbIcon,
  StarIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  KeyIcon,
  LockIcon,
  ShieldIcon,
  ContainerIcon,
  DatabaseIcon,
  HardDriveIcon,
  CloudIcon,
  ExternalLinkIcon,
  NetworkIcon,
  MessageCircleIcon,
  ZapIcon,
  ActivityIcon,
  CookieIcon,
  WebhookIcon,
  FilterIcon,
  LucideIcon,
  SmartphoneIcon,
  CalendarIcon,
  RefreshCwIcon,
  TrashIcon,
  HelpCircleIcon,
  GithubIcon,
  MessageSquareIcon,
} from "lucide-react";

// Icon mapping for string-based icon names
const iconMap: Record<string, LucideIcon> = {
  Play: PlayIcon,
  FileText: FileTextIcon,
  Filter: FilterIcon,
  Keyboard: KeyboardIcon,
  Tag: TagIcon,
  BookOpen: BookOpenIcon,
  Settings: SettingsIcon,
  Users: UsersIcon,
  Code: CodeIcon,
  Search: SearchIcon,
  Share: ShareIcon,
  Download: DownloadIcon,
  Lightbulb: LightbulbIcon,
  Star: StarIcon,
  ArrowRight: ArrowRightIcon,
  ArrowUp: ArrowUpIcon,
  Key: KeyIcon,
  Lock: LockIcon,
  Shield: ShieldIcon,
  Container: ContainerIcon,
  Database: DatabaseIcon,
  HardDrive: HardDriveIcon,
  Cloud: CloudIcon,
  ExternalLink: ExternalLinkIcon,
  Network: NetworkIcon,
  MessageCircle: MessageCircleIcon,
  Zap: ZapIcon,
  Activity: ActivityIcon,
  Cookie: CookieIcon,
  Webhook: WebhookIcon,
  Smartphone: SmartphoneIcon,
  Calendar: CalendarIcon,
  RefreshCw: RefreshCwIcon,
  Trash: TrashIcon,
  HelpCircle: HelpCircleIcon,
  Github: GithubIcon,
  MessageSquare: MessageSquareIcon,
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
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8 not-prose">{children}</div>;
}

export function Card({ title, href, icon, children }: CardProps) {
  // Get the icon component from the icon map
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <Link
      href={href}
      className="group block p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 no-underline shadow-sm"
    >
      <div className="flex items-start space-x-4">
        {IconComponent && (
          <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl group-hover:scale-110 transition-transform">
            <IconComponent className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors tracking-tight">
              {title}
            </h3>
            <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0" />
          </div>
          {children && <div className="text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>}
        </div>
      </div>
    </Link>
  );
}

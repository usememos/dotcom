import {
  ActivityIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  BookmarkIcon,
  BookOpenIcon,
  CalendarIcon,
  CloudIcon,
  CodeIcon,
  ContainerIcon,
  CookieIcon,
  DatabaseIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  FilterIcon,
  GithubIcon,
  HardDriveIcon,
  HelpCircleIcon,
  KeyboardIcon,
  KeyIcon,
  LightbulbIcon,
  LockIcon,
  type LucideIcon,
  MapIcon,
  MessageCircleIcon,
  MessageSquareIcon,
  NetworkIcon,
  PlayIcon,
  PuzzleIcon,
  RefreshCwIcon,
  RssIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  SmartphoneIcon,
  StarIcon,
  TagIcon,
  TerminalIcon,
  TrashIcon,
  UsersIcon,
  WebhookIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

// Icon mapping for string-based icon names
const iconMap: Record<string, LucideIcon> = {
  Play: PlayIcon,
  FileText: FileTextIcon,
  Filter: FilterIcon,
  Keyboard: KeyboardIcon,
  Tag: TagIcon,
  BookOpen: BookOpenIcon,
  Bookmark: BookmarkIcon,
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
  Map: MapIcon,
  Puzzle: PuzzleIcon,
  Terminal: TerminalIcon,
  Rss: RssIcon,
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
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 mb-6 not-prose">{children}</div>;
}

export function Card({ title, href, icon, children }: CardProps) {
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : null;

  if (icon && !iconMap[icon]) {
    console.warn(`Icon "${icon}" not found in iconMap`);
  }

  return (
    <Link
      href={href}
      className="group flex items-start gap-3.5 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-all duration-150 no-underline"
    >
      {IconComponent && (
        <div className="shrink-0 inline-flex items-center justify-center w-8 h-8 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg mt-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          <IconComponent className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors tracking-tight">
            {title}
          </h3>
          <ArrowRightIcon className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
        {children && <div className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">{children}</div>}
      </div>
    </Link>
  );
}

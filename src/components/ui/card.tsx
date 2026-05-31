import {
  ActivityIcon,
  AlertTriangleIcon,
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
  HardDriveIcon,
  HelpCircleIcon,
  KeyboardIcon,
  KeyIcon,
  LightbulbIcon,
  LinkIcon,
  LockIcon,
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
import type { ComponentType, ReactNode, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.92.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

// Icon mapping for string-based icon names
const iconMap: Record<string, IconComponent> = {
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
  AlertTriangle: AlertTriangleIcon,
  Cookie: CookieIcon,
  Webhook: WebhookIcon,
  Smartphone: SmartphoneIcon,
  Calendar: CalendarIcon,
  Link: LinkIcon,
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

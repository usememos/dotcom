import { LinkIcon, MessageCircleMore } from "lucide-react";
import { MemoHeroCard } from "@/components/memo-hero-card";

export function MemoHeroBookmarks({ date }: { date: string }) {
  const links = [
    { title: "Local-first software — the long-term case", source: "inkandswitch.com" },
    { title: "SQLite is not a toy database", source: "antonz.org" },
    { title: "Why I stopped paying for note apps", source: "macwright.com" },
  ];

  return (
    <MemoHeroCard
      date={date}
      title={
        <>
          <span className="mr-2">🔖</span>tabs I need to close
        </>
      }
      tags={["#reading", "#links"]}
      footer={
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2 dark:border-white/10">
            <MessageCircleMore className="h-3.5 w-3.5" />
            <span>1 comment</span>
          </span>
        </div>
      }
    >
      <p className="text-slate-500 dark:text-slate-400">Good stuff I actually want to read, not just stash and forget.</p>
      <ul className="space-y-2.5 text-slate-600 dark:text-slate-300">
        {links.map((link) => (
          <li key={link.title} className="flex items-start gap-2">
            <LinkIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <div className="min-w-0">
              <span className="font-medium text-slate-900 dark:text-slate-100">{link.title}</span>
              <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500">{link.source}</span>
            </div>
          </li>
        ))}
      </ul>
    </MemoHeroCard>
  );
}

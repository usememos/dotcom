import {
  ArrowRightIcon,
  BookOpenIcon,
  CodeIcon,
  GraduationCapIcon,
  LightbulbIcon,
  PenToolIcon,
  ServerIcon,
  ShieldCheckIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";

const USE_CASES = [
  {
    slug: "self-hosting",
    icon: <ServerIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Self-Hosters",
    description: "Infrastructure docs & configs",
    gradient: "from-slate-50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/20",
  },
  {
    slug: "developers",
    icon: <CodeIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Developers",
    description: "Code snippets & debugging logs",
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  },
  {
    slug: "writers",
    icon: <PenToolIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Writers",
    description: "Draft stories & capture ideas",
    gradient: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
  },
  {
    slug: "personal-knowledge",
    icon: <BookOpenIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Journals",
    description: "Daily notes & idea trails",
    gradient: "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
  },
  {
    slug: "hobbyists-makers",
    icon: <WrenchIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Makers",
    description: "Project logs & ideas",
    gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
  },
  {
    slug: "students-researchers",
    icon: <GraduationCapIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Students",
    description: "Lecture notes & research",
    gradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
  },
  {
    slug: "privacy-professionals",
    icon: <ShieldCheckIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Privacy Pros",
    description: "Confidential information",
    gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
  },
  {
    slug: "teams",
    icon: <UsersIcon className="w-6 h-6 sm:w-7 sm:h-7" />,
    title: "Teams",
    description: "Shared notes & updates",
    gradient: "from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20",
  },
];

export function HomeUseCasesSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50/80 to-white px-4 py-12 dark:from-slate-800 dark:to-slate-900 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          icon={LightbulbIcon}
          title="Who Uses Memos?"
          description="Developers, writers, self-hosters, and anyone who wants a faster way to save a thought."
        />

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 sm:mb-12">
          {USE_CASES.map((useCase) => (
            <Link
              key={useCase.title}
              href={`/use-cases/${useCase.slug}`}
              className={`group rounded-xl border border-slate-200 bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg dark:border-slate-700 dark:hover:border-teal-600 sm:p-6 ${useCase.gradient}`}
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/60 text-slate-900 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 dark:bg-slate-800/60 dark:text-slate-100 sm:h-12 sm:w-12">
                {useCase.icon}
              </div>
              <h3 className="mb-1 text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">{useCase.title}</h3>
              <p className="text-xs leading-tight text-slate-600 dark:text-slate-400 sm:text-sm">{useCase.description}</p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:rounded-2xl sm:px-8 sm:py-4 sm:text-base"
          >
            Explore All Use Cases
            <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

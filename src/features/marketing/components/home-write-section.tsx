import Link from "next/link";
import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { MemoAnatomyShowcase } from "@/features/marketing/components/memo-anatomy-showcase";

const TEXT_LINK_CLASS =
  "rounded-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:text-zinc-100 dark:decoration-white/20 dark:hover:text-brand-300 dark:focus-visible:outline-brand-300";

export function HomeWriteSection() {
  return (
    <section id="write" className="scroll-mt-20 bg-white py-16 dark:bg-zinc-950 sm:py-20 lg:py-24">
      <div className="site-container flex flex-col items-center text-center">
        <ChapterHeader eyebrow="Write" title="Simple by default. Powerful when you need it." />

        <div className="mt-14 w-full sm:mt-16">
          <MemoAnatomyShowcase />
        </div>

        <p className="mt-14 max-w-2xl text-pretty text-base leading-7 text-zinc-600 sm:mt-16 sm:text-[1.0625rem] sm:leading-8 dark:text-zinc-300">
          Most memos are a line or two. When a thought needs more, the same memo takes a checklist, a photo, a place, or a link to another
          memo, and others can react and reply. Nothing to set up first.
        </p>
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          Away from Memos? Save pages with the{" "}
          <Link href="/web-clipper" prefetch={false} className={TEXT_LINK_CLASS}>
            Web Clipper
          </Link>{" "}
          or send a message from{" "}
          <Link href="/docs/integrations/telegram-bot" prefetch={false} className={TEXT_LINK_CLASS}>
            Telegram
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

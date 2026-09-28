import { ChapterHeader } from "@/features/marketing/components/chapter-header";
import { HomeFindViews } from "@/features/marketing/components/home-find-views";

export function HomeFindSection() {
  return (
    <section id="find" className="scroll-mt-20 bg-stone-50/70 py-16 dark:bg-zinc-900/35 sm:py-20 lg:py-24">
      <div className="site-container flex flex-col items-center text-center">
        <ChapterHeader eyebrow="Find" title="One timeline, many ways back." />
        <div className="mt-12 w-full sm:mt-14">
          <HomeFindViews />
        </div>
        <p className="mt-12 max-w-2xl text-pretty text-base leading-7 text-zinc-600 sm:mt-14 sm:text-[1.0625rem] sm:leading-8 dark:text-zinc-300">
          There are no folders to dig through. Every memo keeps its day and its place, so you can find it by when you wrote it, where you
          were, or what it says.
        </p>
      </div>
    </section>
  );
}

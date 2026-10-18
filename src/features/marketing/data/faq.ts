import type { FaqItem } from "@/shared/lib/seo";

/** Shared by the visible answers and FAQPage structured data. */
export const HOME_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Is Memos free?",
    answer:
      "Yes. Memos is open-source software under the MIT license, with no license fee. Hosting may still cost money, depending on the hardware or provider you choose.",
  },
  {
    question: "Can I choose where my memos live?",
    answer:
      "Yes. Run Memos with Docker on your server, NAS, or homelab. Your memos stay in that instance’s database: SQLite by default, or MySQL or PostgreSQL. Whoever runs the instance manages its hosting and backups.",
  },
  {
    question: "Does Memos support Markdown?",
    answer: "Yes. You can write lists, code blocks, and checklists in Markdown, and export your memos as a ZIP of Markdown files.",
  },
  {
    question: "Do I need to organize a thought before saving it?",
    answer: "No. You can write without a title or folder. Each memo keeps its date, and you can return to it by calendar, tag, or search.",
  },
  {
    question: "Who can see my memos?",
    answer:
      "New memos are yours alone. You choose whether to share each memo with family and friends or make it available through a public link.",
  },
] as const;

import type { FaqItem } from "@/shared/lib/seo";

/**
 * Homepage FAQ. Single source of truth for both the visible Q&A block and the
 * FAQPage JSON-LD. Questions mirror real search queries from Search Console
 * ("is memos free", "self host memos", "memos markdown", "google keep / notion
 * alternative", "memos private") so the visible text earns question-intent
 * rankings and feeds AI answer surfaces.
 */
export const HOME_FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Is Memos free?",
    answer:
      "Yes. Memos is open-source software under the MIT license, with no license fee. Hosting may still cost money, depending on the hardware or provider you choose.",
  },
  {
    question: "Can I self-host Memos?",
    answer: "Yes. Run it with Docker on your server, NAS, or homelab; SQLite, MySQL, and PostgreSQL are supported.",
  },
  {
    question: "Does Memos support Markdown?",
    answer:
      "Yes. You write memos in Markdown, including lists, code blocks, and checklists. Memos stores them in your instance’s database, and you can export your memos as a ZIP archive.",
  },
  {
    question: "Is Memos a good open-source alternative to Google Keep, Notion, or Evernote?",
    answer:
      "Choose Memos if you want to write short notes quickly and find them later by search, tag, or date, on a server you control. Compare the workflows that matter to you.",
  },
  {
    question: "Where is my data stored, and is it private?",
    answer:
      "Memos are stored in the database of the Memos instance you use. New memos are private by default, and each memo’s visibility setting decides who can see it. Hosting and backups are managed by whoever runs the instance.",
  },
] as const;

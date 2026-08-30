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
    answer: "Yes. Memos is MIT-licensed and free; you only pay for the server you choose.",
  },
  {
    question: "Can I self-host Memos?",
    answer: "Yes. Run it with Docker on your server, NAS, or homelab; SQLite, MySQL, and PostgreSQL are supported.",
  },
  {
    question: "Does Memos support Markdown?",
    answer: "Yes. Memos stores notes as portable Markdown, including lists, code blocks, tags, and tasks.",
  },
  {
    question: "Is Memos a good open-source alternative to Google Keep, Notion, or Evernote?",
    answer: "Choose Memos when you want fast, private, self-hosted notes instead of a hosted workspace.",
  },
  {
    question: "Where is my data stored, and is it private?",
    answer: "Your notes stay in the database on your server, with no third-party cloud or telemetry by default.",
  },
] as const;

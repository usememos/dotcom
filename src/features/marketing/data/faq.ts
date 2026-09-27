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
    answer: "Yes. The self-hosted Memos software is free and MIT-licensed. Hosting costs depend on the hardware or provider you choose.",
  },
  {
    question: "Can I self-host Memos?",
    answer: "Yes. Run it with Docker on your server, NAS, or homelab; SQLite, MySQL, and PostgreSQL are supported.",
  },
  {
    question: "Does Memos support Markdown?",
    answer:
      "Yes. Format notes with Markdown, including lists, code blocks, and checklists. Memos stores note content in your instance’s database.",
  },
  {
    question: "Is Memos a good open-source alternative to Google Keep, Notion, or Evernote?",
    answer:
      "Choose Memos for quick capture, a timeline of notes, and self-hosting. Use search and tags to revisit what you save; compare the workflows that matter to you.",
  },
  {
    question: "Where is my data stored, and is it private?",
    answer:
      "Notes are stored in the database used by your Memos instance. Who can see a note depends on its visibility setting; hosting and backups are managed by the instance operator.",
  },
] as const;

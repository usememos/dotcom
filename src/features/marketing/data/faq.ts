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
      "Yes. Memos is free and open source under the MIT license. You run it yourself, so there are no accounts, subscriptions, or per-seat fees — your only cost is the server you choose to host it on.",
  },
  {
    question: "Can I self-host Memos?",
    answer:
      "Yes — self-hosting is the whole idea. Deploy Memos with a single Docker command in a few minutes on your own server, NAS, or homelab. It stores notes in SQLite by default, with MySQL and PostgreSQL supported for larger deployments.",
  },
  {
    question: "Does Memos support Markdown?",
    answer:
      "Yes. Memos is Markdown-native: every memo is written and stored as plain Markdown, including headings, lists, code blocks, tags, and task lists, so your notes stay portable and never locked into a proprietary format.",
  },
  {
    question: "Is Memos a good open-source alternative to Google Keep, Notion, or Evernote?",
    answer:
      "Memos is a strong fit if you want fast, private capture you fully control rather than a hosted cloud workspace. It is lighter than Notion and self-hosted unlike Google Keep or Evernote, while keeping Markdown notes, tags, and search.",
  },
  {
    question: "Where is my data stored, and is it private?",
    answer:
      "On your own infrastructure. Because you self-host Memos, your notes live in your database on your server — there is no third-party cloud, and the project ships with zero telemetry by default.",
  },
] as const;

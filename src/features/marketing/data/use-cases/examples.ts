import type { HomeMemo } from "@/features/marketing/data/home-memos";
import type { UseCaseSlug } from "./types";

/**
 * A short example timeline for each use case, drawn with the Homepage's memo card. Every memo
 * uses only behavior Memos v0.31 has: inline #tags, Markdown headings and bold labels, task lists,
 * code blocks, links, locations, and emoji reactions. No quotes are attributed to real people.
 */
export const USE_CASE_EXAMPLES: Record<UseCaseSlug, HomeMemo[]> = {
  developers: [
    {
      id: "dev-til",
      kind: "note",
      daysAgo: 0,
      text: "TIL: find the commit that introduced a string. #dev/til",
      code: 'git log -S "parseConfig" --oneline',
      reactions: [{ emoji: "💡", count: 2 }],
    },
    {
      id: "dev-adr",
      kind: "note",
      daysAgo: 1,
      heading: "Why sessions moved to Redis",
      lines: [
        { label: "Decision:", text: "store sessions in Redis, not Postgres." },
        { label: "Because:", text: "login spikes locked the sessions table." },
      ],
      text: "Revisit if we drop the cache tier. #dev/adr",
    },
    {
      id: "dev-debug",
      kind: "note",
      daysAgo: 2,
      text: "Staging keeps timing out on the payments webhook #dev/debug",
      tasks: [
        { text: "Check the retry headers", done: true },
        { text: "Raise the proxy timeout to 30s", done: false },
      ],
    },
  ],
  writers: [
    {
      id: "writer-line",
      kind: "note",
      daysAgo: 0,
      text: "Opening line: the city forgot its rivers long before it paved them. #drafts/essay",
    },
    {
      id: "writer-outline",
      kind: "note",
      daysAgo: 1,
      heading: "Essay: lost rivers",
      lines: [
        { label: "Angle:", text: "what cities bury in order to grow." },
        { label: "Next:", text: "call the local historical society." },
      ],
      text: "Draft due Friday. #drafts/essay",
    },
    {
      id: "writer-research",
      kind: "note",
      daysAgo: 3,
      text: "The Fleet still runs under Farringdon. Keep for the second section. #research",
      link: { label: "River Fleet on Wikipedia", href: "https://en.wikipedia.org/wiki/River_Fleet" },
    },
  ],
  "privacy-professionals": [
    {
      id: "privacy-call",
      kind: "note",
      daysAgo: 0,
      text: "Call moved to Thursday. This memo stays private to me. #work/interviews",
    },
    {
      id: "privacy-checklist",
      kind: "note",
      daysAgo: 1,
      heading: "Before the interview",
      text: "#work/checklists",
      tasks: [
        { text: "Confirm consent to record", done: true },
        { text: "Prepare the three follow-up questions", done: false },
      ],
    },
    {
      id: "privacy-records",
      kind: "note",
      daysAgo: 3,
      text: "Records request filed, response window is 20 working days. #work/research",
    },
  ],
  "students-researchers": [
    {
      id: "student-lecture",
      kind: "note",
      daysAgo: 0,
      text: "Lecture 7: enzyme rate levels off once every active site is busy. #bio/lectures",
    },
    {
      id: "student-paper",
      kind: "note",
      daysAgo: 1,
      heading: "Paper notes: Michaelis–Menten, revisited",
      lines: [
        { label: "Claim:", text: "the classic model holds at low substrate levels." },
        { label: "Use:", text: "chapter 2 background." },
      ],
      text: "#reading/papers",
    },
    {
      id: "student-exam",
      kind: "note",
      daysAgo: 2,
      text: "Exam prep for Friday #study",
      tasks: [
        { text: "Redo problem set 4", done: true },
        { text: "Flashcards: enzyme kinetics", done: false },
      ],
    },
  ],
  "personal-knowledge": [
    {
      id: "journal-walk",
      kind: "note",
      daysAgo: 0,
      text: "Slept badly, walked it off by the river. The herons are back. #journal",
      location: "Riverside Park",
    },
    {
      id: "journal-weekly",
      kind: "note",
      daysAgo: 1,
      heading: "This week",
      lines: [
        { label: "Good:", text: "finished the pottery class project." },
        { label: "Try next:", text: "phone stays in the hallway after 10pm." },
      ],
      text: "#journal/weekly",
    },
    {
      id: "journal-idea",
      kind: "note",
      daysAgo: 3,
      text: "Idea: a tiny book-swap box on our street. #ideas",
      reactions: [{ emoji: "💛", count: 1 }],
    },
  ],
  "hobbyists-makers": [
    {
      id: "maker-keyboard",
      kind: "note",
      daysAgo: 0,
      text: "Keyboard build: 62g springs feel much better for long typing. #projects/keyboard",
    },
    {
      id: "maker-print",
      kind: "note",
      daysAgo: 2,
      text: "PETG settings that finally stopped the stringing #projects/printing",
      code: "nozzle 240°C · bed 80°C · fan 30%",
    },
    {
      id: "maker-shop",
      kind: "note",
      daysAgo: 4,
      text: "Workbench shopping list #shop",
      tasks: [
        { text: "M3 brass inserts", done: true },
        { text: "Flux pen", done: false },
      ],
    },
  ],
  "self-hosting": [
    {
      id: "homelab-upgrade",
      kind: "note",
      daysAgo: 0,
      text: "Upgraded Memos to v0.31. Migrations ran on startup. #homelab/changelog",
      reactions: [{ emoji: "🚀", count: 1 }],
    },
    {
      id: "homelab-caddy",
      kind: "note",
      daysAgo: 1,
      text: "Reverse proxy for the Memos box #homelab/config",
      code: "memos.home.lan {\n  reverse_proxy localhost:5230\n}",
    },
    {
      id: "homelab-backup",
      kind: "note",
      daysAgo: 3,
      text: "Monthly backup check #homelab/ops",
      tasks: [
        { text: "Snapshot ~/.memos", done: true },
        { text: "Test a restore on the spare Pi", done: false },
      ],
    },
  ],
  family: [
    {
      id: "family-recipe",
      kind: "note",
      daysAgo: 0,
      text: "Grandma’s dumpling recipe, finally written down. #family/recipes",
      reactions: [
        { emoji: "😋", count: 3 },
        { emoji: "💛", count: 2 },
      ],
    },
    {
      id: "family-carpool",
      kind: "note",
      daysAgo: 1,
      text: "Soccer carpool this week #family/plans",
      tasks: [
        { text: "Monday: Alex drives", done: true },
        { text: "Wednesday: my turn", done: false },
      ],
    },
    {
      id: "family-trip",
      kind: "note",
      daysAgo: 2,
      heading: "Summer trip ideas",
      lines: [
        { label: "Mia:", text: "somewhere with a beach." },
        { label: "Sam:", text: "a night train, any direction." },
      ],
      text: "#family/travel",
    },
  ],
  teams: [
    {
      id: "team-standup",
      kind: "note",
      daysAgo: 0,
      heading: "Standup",
      lines: [
        { label: "Shipped:", text: "the new onboarding email." },
        { label: "Blocked:", text: "waiting on the staging database." },
      ],
      text: "#team/standup",
    },
    {
      id: "team-decision",
      kind: "note",
      daysAgo: 1,
      text: "Decision: we release on Tuesdays from now on. #team/decisions",
      reactions: [{ emoji: "👍", count: 4 }],
    },
    {
      id: "team-oncall",
      kind: "note",
      daysAgo: 3,
      text: "On-call handover #team/ops",
      tasks: [
        { text: "Rotate the API keys", done: true },
        { text: "Close the disk alert on db-2", done: false },
      ],
    },
  ],
};

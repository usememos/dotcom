# Memos Brand Guidelines

**Status:** Authoritative and stable. This is the single source of truth for what Memos is and how we describe it. The core, tagline, and supporting description are fixed until the **2027-09 review**; see [Changing This Guide](#changing-this-guide). [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) governs how the brand is applied visually on the public website.

## Brand Core

**Memos is a personal timeline for your thoughts.** You write short memos as they come. They build up in the order they happened, and you find them again when you need them.

| | |
|---|---|
| **The memo** | One thought, written down. Short, untitled, and never filed before it is written. The product is named after it. |
| **The timeline** | Where memos live. Time is the natural order of what someone thinks, notices, and does. |
| **Belief** | Writing comes before organizing. Titles and folders ask for decisions too early. Write first; add structure later with tags, links, and views. |
| **Promise** | Save it now. Find it later. |
| **For** | Individuals who think in small pieces: ideas, links, logs, and updates. Personal use comes first; sharing with others is a second chapter, never the lead. |
| **Not** | An all-in-one workspace, a document editor, or a knowledge-management system. |
| **Character** | Quiet, direct, and honest. |

Every message, feature description, and campaign must be explainable from this core. If a piece of copy cannot be traced back to it, rewrite the copy rather than stretching the core.

## Message Hierarchy

Tell the story in this order. Lead with the first; never lead with the third.

| Order | Message | What to Show |
|---|---|---|
| 1 | **Write** — get a thought down before it is gone. | The composer and a real memo being saved |
| 2 | **Find** — get back to it by searching, filtering, or browsing through time. | Search, tags, views, and the timeline |
| 3 | **Own** — your memos stay where you choose. | Self-hosting, open code, and export |

**Own is the trust foundation, not the identity.** Self-hosted and open source are facts that prove "Keep it yours"; they are not what Memos is. Use them in trust sections, comparisons, documentation, and search metadata. Do not open a hero, headline, or introduction with them.

**Proof points.** The landing page promotes Own with these three points, shown as the homepage hero checklist from `BRAND_PROOF_POINTS`. Use them as supporting badges, checklists, or a trust section, never as the tagline or hero headline. Each is approved only with its condition.

| Proof Point | Condition | Verified |
|---|---|---|
| **Private and free** | "Private": new memos default to private visibility. "Free": the software is open source with no license fee; hosting may still cost money. | Memos v0.31 |
| **Zero telemetry** | Scoped to the Memos software: it sends no usage data or analytics. It does not describe this website or third-party hosts. | Memos v0.31 |
| **Deploys in seconds** | Use it only on a page that links the install guide and shows the one-command Docker install; the homepage hero's install action and Deploy section satisfy this. It assumes Docker is already available. | Memos v0.31 |

Re-verify each condition against the current Memos release before the annual review, or immediately if a release changes privacy defaults, adds outbound network calls, or changes installation.

**Promise finding, not resurfacing.** Memos helps people find what they look for. Do not claim that it brings memos back on its own ("rediscover", "resurface", "daily review", "on this day") unless the product ships that behavior.

## Approved Copy

| Use | Copy |
|---|---|
| Tagline | **Catch a thought. Keep it yours.** |
| Supporting description | Write short memos without titles or folders. Find them later by search, tag, or date. |
| One-sentence introduction | Memos is a personal timeline for quick notes: write short memos as they come, and find them later by search, tag, or date. |
| Search descriptor | open-source, self-hosted note-taking app |

- **Tagline:** use it exactly, in sentence case with both periods. A line break between the sentences is allowed. It appears on the homepage hero and the default social preview. The default branded title is `Memos - Catch a thought. Keep it yours.`
- **Supporting description:** pair it with the tagline, or use it wherever a short product introduction is needed. It names how Memos is different (no titles or folders) and what it promises (finding). The default social image uses only its first sentence, because the full line does not fit at sharing size; metadata keeps the full line.
- **One-sentence introduction:** use it for READMEs, directories, app listings, and community posts. Longer introductions may add verified details in message-hierarchy order.
- **Search descriptor:** use it only where a category term helps people find Memos: title tags, meta descriptions, comparison pages, and directory categories. It describes the category; it is not the brand line.
- Campaign headlines and page headings may differ but must not act as replacement taglines. Do not repeat the tagline in every heading.
- The tagline has no approved translation. Translating it requires a decision recorded in this guide.

## Words

**Naming**

- **Memos** is the product. It takes a singular verb: "Memos is". Never "MEMOS" or "the Memos app".
- **memo** is the thing a person writes, in lowercase. Prefer "memo" when describing the product; "note" is fine in explanatory and search copy.
- **View** (视图) is a saved way of finding memos. If the product offers an action that saves a filter, call it "Save as view" (保存为视图); the result is still a View. Keep "Memos" untranslated in every language.

**Prefer and avoid**

| Prefer | Avoid |
|---|---|
| write, save, find, look back | rediscover, resurface, review (until shipped) |
| personal timeline, your memos | second brain, knowledge base, all-in-one workspace |
| quick, short, simple (shown, not asserted) | fastest, effortless, lightning-fast, seamless |
| "written in Markdown" | "Markdown-native", "stored as Markdown files" |
| "private" for memo visibility, or the proof point "Private and free" | privacy-first, end-to-end encrypted, unhackable |
| "free", "open source", "no license fee" | "free forever", "free hosting" |
| "zero telemetry" for the Memos software | "we never track you" (implies this website and every host) |

## Voice

| Trait | Write | Avoid |
|---|---|---|
| **Quiet** | Short, concrete sentences. One idea per section. | Hype, urgency, exclamation marks, feature lists in headlines |
| **Direct** | Start with what someone can do: write a memo, find a link, look back at a day. | Abstract introductions and jargon |
| **Honest** | State behavior precisely and the conditions behind it. | Superlatives, fear-based privacy copy, and guarantees |

Say what Memos is. Keep what it is not as editorial guidance; do not turn it into repeated "not a…" headlines.

| Instead of | Write |
|---|---|
| "The fastest self-hosted second brain." | "Write a memo in seconds. Find it next month." |
| "Privacy-first note-taking." | "Your memos stay on the server you choose." |
| "Rediscover forgotten ideas every day." | "Search, filter by tag, or look back through any day." |

## Claims

"Keep it yours" means control and ownership. Keep it separate from visibility, security, and availability.

- **Hosting:** describe the control available to whoever runs an instance. Do not imply every user runs a server or that hosting guarantees access.
- **Privacy:** describe the actual visibility setting and who can see a memo. Self-hosting does not mean encryption or local-only use.
- **Markdown:** Markdown is the memo content format. Describe export and backup separately; do not imply memos are individual `.md` files.
- **Speed and setup:** show the workflow. Link setup claims to current instructions; "Deploys in seconds" follows its proof-point condition. No comparative speed claims without measurements.
- **Tracking and cost:** name the scope — the software, this website, or a hosted service — and verify it before publishing. "Zero telemetry" and "free" follow their proof-point conditions.
- **Evidence:** base product claims on current documentation or behavior. Research, testimonials, and adoption figures need a linked source and date. State positioning as a choice ("We lead with writing"), not as research ("Users value writing most"). GitHub stars show interest, not quality.

## Identity Assets

- **Logos:** `public/logo.png`, `logo-rounded.png`, `full-logo.png`, and `full-logo-landscape.png`, published at `/brand`. Keep their proportions and give them clear space.
- **Wordmark:** text-only "Memos" set in Fraunces Black.
- **Color:** the `brand-*` blue scale in `src/app/global.css`.
- **Social previews:** a cobalt sky with ivory clouds and bird silhouettes.

DESIGN_SYSTEM.md defines how these are applied on the website.

## Changing This Guide

**Stability.** The Brand Core, message hierarchy, tagline, and supporting description stay fixed until the 2027-09 review. Before then, change them only to correct a factual error or because the product's memo-and-timeline model itself changed. Wording guidance, examples, and the word list may be refined at any time if they stay consistent with the core.

**Process.** Change this file, `src/shared/lib/branding.ts`, and the tests that reference them in the same commit, then record the change below. When shipping rendered brand copy, check the homepage at desktop and mobile widths, the default social preview at sharing size, and metadata.

**Scope.** This guide covers the website, documentation, the GitHub README and repository description, directory listings, and social profiles. Surfaces outside this repository are updated by hand.

**Decision log**

| Date | Decision |
|---|---|
| 2026-09-28 | Rebuilt the core around the memo and the personal timeline. Personal first; promise finding, not resurfacing. Self-hosting and open source become the trust foundation. New supporting description. The tagline is kept. |
| 2026-09-28 | Approved "Private and free", "Zero telemetry", and "Deploys in seconds" as landing-page proof points for Own, each with a verified condition. |
| 2026-09-28 | Owner-approved exception to the stability rule during the landing-page redesign: the supporting description now states the belief and the promise instead of listing note types. |

Retired taglines: `Capture first. Keep it yours.`, `Fast enough for every thought. Private enough for all of them.`, and `An open-source, self-hosted notebook.` Preserve them in historical quotations and published release notes only.

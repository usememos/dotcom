# Memos Brand Guidelines

**Status:** Authoritative. This document defines product-level messaging for Memos, including the website, default social previews, metadata, and product introductions. [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) remains the visual design authority.

Use this guide when writing about Memos: on the website, in documentation, in community introductions, or in partner material. The positioning below records deliberate messaging choices. Claims about user preferences or product performance require separate evidence.

## Positioning

### Mission

Make it easy to capture thoughts, revisit them, and keep control of them.

### Vision

A world where saving a thought is as easy as having one, and people control where those thoughts live.

### Positioning Statement

Memos is an open-source, self-hosted note-taking tool for quick capture. Save notes, daily logs, links, and ideas in Markdown, revisit them through a timeline, search, and tags, and run it on infrastructure you control.

### Benefit Hierarchy

Lead with capture. Explain why the notes remain useful and how users retain control.

| Benefit | What to Communicate | Product Details to Show |
|---------|---------------------|-------------------------|
| **Capture easily** | Write something down while it is still fresh. | The note editor and the flow from writing to saving |
| **Revisit what matters** | Find a saved note or look back through your days. | Timeline, search, tags, and review flows |
| **Retain control** | Choose where Memos runs and manage the data you keep there. | Self-hosting, open-source code, and documented backup and export options |

Lightweight design supports all three benefits. Demonstrate it through a clear workflow or deployment instructions rather than asserting that every part of the experience is effortless.

### Positioning Boundary

Quick capture and a timeline for personal notes are the starting point for the brand. Avoid promising an all-in-one knowledge-management suite. This is a messaging focus, not a permanent limit on product development: describe organization, sharing, and other supported features through the user outcomes they serve.

General introductions should stand on their own. Discuss how Memos compares with or complements other tools when that comparison helps the reader make a specific choice.

## Approved Copy

### Tagline

**Catch a thought. Keep it yours.**

### Supporting Description

Quick notes, daily logs, and ideas. Open source and yours to host.

### Elevator Pitch

Memos is an open-source, self-hosted note-taking tool for quick notes, daily logs, links, and ideas. Open it, write a thought, and save it in Markdown. Your notes form a timeline you can revisit, with search and tags to help you find something again. Run Memos on infrastructure you control.

### Usage Rules

- Use the tagline exactly, including sentence case and both periods. A line break between the two sentences is allowed; rewriting, reordering, or shortening either sentence requires an explicit branding decision.
- Use the tagline on the homepage hero and default brand-level social preview. Default branded metadata titles use `Memos - Catch a thought. Keep it yours.`. Page-specific search titles, article titles, and descriptions should describe their actual content.
- Use the supporting description when a short product introduction is needed. Longer SEO, documentation, and feature descriptions may add factual details consistent with the positioning.
- Campaign headlines and task-specific UI copy may differ. They must not be presented as replacement product taglines. Do not insert the slogan into every page heading, control, or error message.
- `An open-source, self-hosted notebook.` is not the approved product introduction. Do not reintroduce it as the tagline or default image description. “Notebook” may still appear in ordinary explanatory or historical content where it is accurate.
- Previous taglines, including `Capture first. Keep it yours.` and `Fast enough for every thought. Private enough for all of them.`, are retired for current brand surfaces. Preserve historical quotations and published release content.
- There is no approved translated tagline yet. Translations require a separate wording decision rather than inventing a new English or localized variant.

## Voice

Memos should sound **immediate, trustworthy, and focused**.

| Trait | How to Write | Avoid |
|-------|--------------|-------|
| **Immediate** | Use short, concrete sentences. Start with what someone can do: write a note, save a link, find an idea. | Abstract introductions, breathless urgency, and feature lists in headlines |
| **Trustworthy** | Describe supported behavior precisely. State the conditions behind a claim. | Superlatives, fear-based privacy messaging, and unsupported guarantees |
| **Focused** | Give each section one clear user benefit and enough detail to understand it. | Repeated competitor references, defensive exclusions, and promises to cover every workflow |

Lead public copy with what Memos enables. Keep positioning boundaries as editorial guidance; do not turn them into repeated headlines about what Memos is not.

## Claims and Evidence

“Keep it yours” means user control and ownership. Keep that promise distinct from note visibility, deployment security, and availability.

| Topic | Wording and Evidence Rule | Do Not Imply |
|-------|---------------------------|--------------|
| **Ownership and hosting** | Describe self-hosting and the control it gives the person operating an instance. Scope claims to the deployment being described. | Every user operates their own server, or hosting guarantees perpetual access |
| **Privacy and visibility** | Describe the actual visibility settings and who can access notes in the relevant context. Use “private” when that context supports it. | Every deployment or note is private, or self-hosting means end-to-end encryption or local-only operation |
| **Markdown and portability** | Describe Markdown as the note content format. Explain supported export and backup workflows separately when relevant. | “Markdown-native” means notes are stored as individual `.md` files, or Markdown alone makes all application data portable |
| **Speed and setup** | Show the capture flow. Link setup claims to current instructions and their prerequisites. Use comparative speed claims only with relevant measurements. | Memos is the “fastest,” setup takes a fixed time for everyone, or operating a server requires no maintenance |
| **Ads and tracking** | Verify the behavior and identify the scope: the Memos software, website, or a particular hosted service. | A product-level statement automatically covers every operator, integration, or external service |
| **Cost and subscriptions** | Distinguish software pricing, infrastructure costs, and any hosted-service terms. Verify current terms before publishing. | Free software means free hosting, or all services using Memos have the same pricing |

Support claims with evidence that proves the specific point:

- Use current documentation, implementation, or a demonstrated workflow for product capabilities.
- Link a source and date for user research, testimonials, adoption figures, or performance comparisons. Keep quotations faithful and distinguish individual feedback from broader findings.
- Without research, state a positioning choice directly: “We lead with quick capture.” Do not recast it as “Users value quick capture most.”
- GitHub stars indicate interest; they do not establish usability, reliability, or privacy. An open-source license establishes licensing terms, not a security guarantee.

## Context and Examples

Adapt the emphasis to the reader's task while keeping the same positioning.

| Reader's Task | Emphasis |
|---------------|----------|
| Decide whether Memos fits their note-taking habits | Show capture, timeline, and ways to revisit notes with concrete examples. |
| Deploy and maintain an instance | Explain prerequisites, deployment, backups, and upgrades. |
| Understand privacy and control | Explain hosting, visibility, and data management in the relevant deployment. |
| Build an integration or contribute | Describe documented APIs, supported extension points, and contribution paths. |
| Compare note-taking tools | Address the actual workflow and tradeoffs. Include other tools only where useful to the comparison. |

Examples below illustrate tone and structure. They are not required strings; any capability or change mentioned must be verified for the content being published.

| Context | Example or Direction |
|---------|----------------------|
| Homepage hero | “Catch a thought. Keep it yours.” |
| Supporting headline | “Find the thought you saved last week.” |
| Product description | “Write a quick note, save a link, or look back through your daily logs.” |
| Feature description | “Use tags to bring related notes together.” |
| Docs | “Follow the Docker setup guide to run Memos on your server.” |
| Blog posts | Explain a concrete workflow or product decision and the reasoning behind it. |
| GitHub README | “Memos is an open-source, self-hosted note-taking tool for quick capture.” |
| Release notes | Name the behavior that changed and its effect. Hypothetical example: “Fixed search results losing the selected tag when you change pages.” |
| Social posts | Show one useful workflow or a specific shipped change. |
| Comparison pages | Explain who benefits from each approach and support factual differences with current sources. |

## Implementation and Maintenance

### Canonical Strings

Use `src/shared/lib/branding.ts` for executable copies of the tagline, its two display lines, the default branded title, and the supporting description. Do not duplicate these strings in components or metadata.

When changing those canonical strings, update this document, `src/shared/lib/branding.ts`, and verification expectations together. Changes to editorial guidance do not require changing approved strings.

### Visual Use

Follow [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) for typography, layout, colors, and social-preview artwork. In OG images, keep the tagline or page title primary and supporting copy readable within one or two lines. Preserve the text-only Memos wordmark and the approved sky, clouds, and bird silhouettes.

### Verification

When shipping changes to rendered brand copy, check the affected homepage at desktop and mobile widths, default and content OG images at sharing size, and rendered metadata as applicable. Check factual claims against current product behavior and documentation.

Changes in this repository do not automatically update separate Memos application repositories or externally managed profiles.

# Memos Website Design System

**Status:** Authoritative, version 0.1
**Primary reader:** Coding agents maintaining the Memos public website

This document is the design contract for the project-owned public website at
`usememos.com`. It turns the judgment visible in the Homepage and Web Clipper
pages into rules that an agent can apply, test, and extend without making every
page look the same.

The system owns the design grammar and the method used to choose a composition.
The page's subject and content determine the final composition.

## 1. Normative language

The words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are
normative.

- **MUST** and **MUST NOT** are release requirements.
- **SHOULD** is the default. Depart from it only when another rule in this
  document explains why the context differs.
- **MAY** identifies a supported choice, not an invitation to improvise a new
  visual language.

Vague qualities such as "modern," "clean," or "polished" are not rules. A rule
must name its scope, decision method, implementation boundary, or verification
condition.

## 2. Scope

This system applies to the project-owned public site:

- `src/app/(public)/(site)/`
- `src/features/marketing/`
- `src/features/editorial/`
- the public site header and footer
- shared UI used by those surfaces when the change is safely scoped

It includes the Homepage, Web Clipper, Features, Use Cases, Compare, Pricing,
Sponsors, Brand, Privacy, Blog, and Changelog pages.

This system explicitly does **not** own:

- `src/app/(public)/docs/` or `src/features/docs/`
- `src/app/(app)/`
- `src/app/(auth)/`
- `src/features/overview/`, `src/features/connections/`, or
  `src/features/account/`
- `.app-surface` or authenticated-product tokens and interactions

An agent MUST NOT redesign, migrate, or restyle an excluded surface while doing
website design-system work. A change to a shared file such as
`src/app/global.css` or `src/shared/ui/` MUST be checked for effects on excluded
surfaces before it is accepted.

Product screenshots and interface reconstructions shown on the public site are
website content. They are not a request to define or redesign the Memos product
UI.

## 3. Authority and precedence

When sources disagree, use this order:

1. An explicit, locally scoped instruction from the user to treat a named area
   specially.
2. This `DESIGN_SYSTEM.md`.
3. Current shared components and tokens.
4. Existing page implementation.
5. External design systems, examples, and generic best practices.

Only an explicit user instruction that identifies the special treatment can
override this system. Existing code, a historical screenshot, convenience, or
an agent's taste cannot create an exception.

If implementation and this document disagree, the agent MUST bring the
implementation into compliance. It MUST NOT weaken the document merely to make
the current code pass.

## 4. How an agent uses this system

Before editing a public page, the agent MUST:

1. Read the page's real content and identify its audience and single primary
   job.
2. Classify the page using the archetypes below.
3. Write down the primary claim, strongest available proof, primary action, and
   page-specific signature.
4. Inspect the relevant reference implementation and shared primitives.
5. Choose a composition using the decision rules in this document.
6. Implement with the established type, color, spacing, interaction, and
   accessibility roles.
7. Add tests for every new machine-verifiable rule and complete visual
   verification.

Agents MUST begin with the content and the proof, not with a generic landing-page
template.

## 5. Reference implementations

The references are evidence for this system, not templates to clone.

### Homepage: the evergreen brand thesis

Primary sources:

- `src/app/(public)/(site)/page.tsx`
- `src/features/marketing/components/hero-section.tsx`
- `src/features/marketing/components/home-*-section.tsx`
- `src/features/marketing/components/memo-hero-mock.tsx`
- `src/features/marketing/components/home-hero.module.css`

The Homepage establishes the default relationship between editorial display
type, quiet neutral space, concise copy, restrained teal emphasis, and a real
product artifact. It also demonstrates that related content can use open grids,
lists, and occasional dividers instead of a field of cards. Its whitespace and
alignment are the primary grouping devices; the dividers are not a default
decoration to repeat elsewhere.

### Web Clipper: a focused campaign

Primary sources:

- `src/app/(public)/(site)/web-clipper/page.tsx`
- `src/features/marketing/components/web-clipper-showcase.tsx`
- `src/features/marketing/components/web-clipper-showcase.module.css`

Web Clipper demonstrates a page-specific campaign identity. Its ink-blue hero,
browser reconstruction, selection highlight, and local animation belong to the
subject of clipping from a browser. They are not the default treatment for other
pages.

When the two references differ, the agent MUST identify the contextual reason.
It MUST NOT average the designs together or select whichever implementation is
easier to copy.

## 6. Design character

The public website is a quiet editorial frame for proving a small, open-source,
self-hosted tool through real artifacts and specific language.

The following traits are observable requirements:

- **Editorial hierarchy.** Serif display type carries the thesis. Sans-serif
  text explains it. Monospace identifies code, versions, and technical data.
- **Quiet canvas.** Neutral surfaces and generous open space are the default.
  Teal signals emphasis and action; it does not flood every section.
- **Product as evidence.** Real interface behavior, Markdown, browser context,
  deployment commands, and project facts carry more weight than abstract
  illustration.
- **Content-shaped composition.** Layout follows the page's claim and proof.
  Repeated cards are not the default site structure.
- **One earned signature.** A page MAY have one memorable visual treatment when
  it comes directly from the page's subject. Everything around it stays quiet.
- **Human, direct language.** The site explains what a person can do and control
  without inflated productivity language.

Precision is a required execution quality, but it is not a distinct brand idea.

## 7. Page archetypes

Classify a page before composing it. A route MAY combine adjacent archetypes,
but it MUST have one dominant archetype.

### 7.1 Brand thesis

Examples: Homepage and major brand-level pages.

- MUST express one durable idea about Memos.
- MUST use a custom narrative sequence rather than a reusable SEO-page shell.
- MUST show the product or a concrete project artifact early.
- MAY use a larger display scale and more varied section rhythm.

### 7.2 Focused campaign or tool

Example: Web Clipper.

- MUST organize the page around the tool's real workflow and strongest visual
  evidence.
- MAY introduce a scoped palette, artifact, or motion signature derived from
  the tool.
- MUST return to the shared site grammar outside the signature composition.
- MUST NOT turn the campaign palette into a new global theme.

### 7.3 Catalog, comparison, and search-oriented marketing

Examples: Features, Use Cases, Compare, Pricing, and their detail pages.

- MUST answer the visitor's evaluation question before expanding into detail.
- SHOULD use a repeatable information architecture when sibling pages contain
  the same kinds of evidence.
- A Use Case index SHOULD organize entries by the visitor's context or job, not
  present every audience as an undifferentiated card grid. Independent workflows
  MUST NOT be numbered unless their order is meaningful.
- A comparison detail page MUST place its honest short verdict before the full
  table. It SHOULD use rows and column alignment as its signature structure, and
  MUST NOT repeat the H1 as an otherwise empty section heading.
- Related Feature links MUST resolve to existing public routes. A link to a WIP
  Feature MUST expose that status before the visitor follows it.
- MUST vary hierarchy and proof according to the content; a shared shell does
  not require identical section order or decoration.
- MUST NOT manufacture arbitrary statistics, customer logos, testimonials, or
  feature claims to fill a conventional landing-page template.

### 7.4 Editorial index and article

Examples: Blog and Changelog.

- MUST prioritize scanning, chronology, and reading measure.
- MUST use the project-owned `typeset-editorial` preset for rendered article
  prose.
- SHOULD favor open lists, metadata, strong titles, and whitespace over card
  grids. Rules MAY clarify dense editorial rows but SHOULD remain sparse.
- MUST keep promotional interruptions secondary to the article.

### 7.5 Institutional and utility

Examples: Sponsors, Brand, and Privacy.

- MUST optimize for comprehension and trust.
- SHOULD use the quietest expression of the system.
- MAY use compact page headers and denser reading layouts.
- MUST NOT add a campaign treatment merely to make a utility page feel more
  designed.

## 8. Composition

### 8.1 The hero is the thesis

Every marketing hero MUST make the page's main claim and strongest proof
identifiable without reading the rest of the page.

A hero is not a standardized page shell. This system standardizes its quality
boundaries — container ownership, type roles, action hierarchy, accessibility,
content-sized height, and responsive reading order — but it does **not**
standardize its composition. The page's subject determines whether the hero is
centered, split, artifact-led, text-led, diagrammatic, compact, quiet, or
campaign-like.

Before choosing hero markup, the agent MUST name the page-specific proof and
choose a form that makes that proof most legible. For example:

- the Homepage pairs its durable brand claim with a believable memo artifact
- Web Clipper stages the browser selection and clipping workflow
- Pricing makes the absence of plans concrete through a `$0` ledger
- Privacy explains trust through the short self-hosted data path

These are examples of content-shaped decisions, not four new templates. A new
page MUST derive its hero from its own evaluation question, material, and
strongest proof.

Use this decision sequence:

1. Name the primary claim in one sentence.
2. Choose the most credible available proof.
3. Make either the claim or the proof dominant; do not give every element equal
   weight.
4. Place the primary action next to the claim.
5. Remove anything that does not help establish the claim, proof, or action.

A split hero SHOULD be used when a meaningful product artifact exists. A
centered hero MAY be used when the message itself is the subject and no visual
proof deserves equal prominence. Centered copy MUST NOT be the automatic
choice.

`MarketingPageHero` and other shared hero components MAY be used when their
claim/proof relationship genuinely fits the page. Their availability MUST NOT
decide the composition. When the page needs a different hierarchy, surface,
artifact, or reading order, the route SHOULD own its hero markup or introduce a
page-scoped hero component while continuing to use the shared tokens and action
primitives.

Heroes MUST be content-sized. They MUST NOT use `h-screen`, `min-h-screen`, or
custom `100vh`/`100svh`/`100dvh` minimum heights.

A hero SHOULD expose at least part of its proof on a typical desktop viewport.
It MUST remain coherent when actions stack and the proof moves below the copy on
mobile.

### 8.2 Section sequence

Sections MUST form a narrative, not a feature inventory. A common sequence is:

1. Claim and proof
2. Why the subject matters
3. How it works
4. Evidence or technical reality
5. Objections and answers
6. Next action

This is a reasoning sequence, not a mandatory template. An agent MUST remove,
merge, or reorder steps when the page does not have the corresponding content.

Alternating backgrounds MAY separate meaningful chapters. They MUST NOT create
automatic zebra striping. Adjacent sections that belong to the same thought
SHOULD share a surface and rely on spacing and alignment for separation. Add a
rule only when removing it would make the chapter boundary or reading order
ambiguous.

### 8.3 Open structures before cards

Use a card only when the item is independently bounded, comparable, or
actionable. Use an open grid, typographic group, or split section when items are
parts of one argument. A divider list MAY be used for dense, repeated rows whose
boundaries would otherwise be difficult to scan; it MUST NOT be the automatic
open alternative to cards.

Agents MUST NOT wrap headings, paragraphs, metrics, or icons in cards solely to
make the layout feel complete. A repeated card grid MUST NOT become the dominant
visual structure of a page unless comparison is the page's actual task.

### 8.4 Page signature

Each major marketing page SHOULD have one named signature composition. The
signature MUST arise from the subject's real material:

- a browser selection and clip panel for Web Clipper
- an accurate memo timeline for quick capture
- a real command surface for deployment
- a truthful comparison structure for a comparison page

The signature MAY use a page-owned component, CSS module, scoped palette, or
custom animation. Those choices are allowed by the system and are not an
exception when they remain inside the named composition.

The rest of the page MUST become quieter around the signature. Agents MUST NOT
add multiple competing signature treatments.

## 9. Layout

### 9.1 Shared width

Every full-width public-site section MUST contain a `site-container`. The
container owns the shared maximum width, centering, and mobile gutter through
`--site-layout-width` in `src/app/global.css`.

- MUST NOT add an outer `max-w-*` page shell.
- MAY use inner `max-w-*` values to control readable text measure or the size of
  a product artifact.
- MUST keep full-bleed backgrounds and rules outside the container.
- MUST NOT duplicate the site-width value in a component.

### 9.2 Grid and alignment

- Begin mobile-first with one column.
- Introduce columns only when the content relationship benefits from them.
- Prefer asymmetric desktop splits such as claim/proof or heading/explanation
  over equal columns by default.
- Use equal columns only for genuinely comparable content.
- Align related baselines and edges; do not center each section independently.
- Preserve the narrative order when a grid collapses.
- The page MUST NOT create horizontal scrolling at 320 CSS pixels or wider.

### 9.3 Section rhythm

Use one of these established rhythms:

- Standard marketing chapter: `py-16 sm:py-20 lg:py-24`
- Emphatic dark chapter: `py-20 sm:py-24 lg:py-28`
- Compact campaign or utility chapter: `py-14 lg:py-20`
- Editorial shell: `py-14 lg:py-20`

Departures MUST be explained by the composition, such as an overlapping product
artifact or the first/last section's relationship to site chrome. Arbitrary
section-by-section spacing is not permitted.

## 10. Typography

The global font roles are fixed:

| Role | Family | Use |
| --- | --- | --- |
| Display | Source Serif 4 through `font-serif` | Page thesis, section thesis, editorial titles |
| Body and UI | Inter through the body default | Explanations, navigation, actions, metadata |
| Technical | `font-mono` | Code, versions, technical values, compact technical status |

Monospace MUST NOT be used as a generic brand accent. Uppercase MUST be limited
to short eyebrows, navigation labels, and compact metadata; sentences stay in
sentence case.

### 10.1 Display roles

Use the closest established role. A new size requires an update to this section
before implementation.

| Role | Canonical treatment |
| --- | --- |
| Brand hero | `font-serif text-[3.25rem] leading-[0.96] font-semibold tracking-[-0.04em] sm:text-6xl lg:text-[4.25rem]` |
| Campaign hero | `font-serif text-5xl leading-[0.98] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl` |
| Standard marketing H1 | `font-serif text-5xl leading-[1.04] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-7xl` |
| Section thesis | `font-serif text-[2.5rem] leading-[1.03] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[3.35rem]` |
| Compact section title | `font-serif text-3xl font-semibold tracking-tight sm:text-4xl` |
| Editorial index H1 | `font-serif text-4xl font-semibold sm:text-6xl` |

Display headings MUST use `text-balance`, but balance is not a substitute for a
correct content column. A page H1 MUST use the available hero column by default;
agents MUST NOT add a character-based `max-w-[Nch]` merely to manufacture a
silhouette. Constrain the hero grid or title region first, then keep supporting
copy on its own narrower prose measure.

A character-based measure MAY be used on a section thesis when the copy has a
clear authored cadence and the result has been inspected at real breakpoints.
It MUST be removed or widened when it creates an avoidable extra line, a final
line of one or two short words, or conspicuous unused width inside the heading's
own column. Forced block-level line breaks are reserved for deliberately authored
campaign phrases, and MUST remain readable on narrow screens. Agents
MUST NOT force every title into the same line count.

### 10.2 Supporting roles

- Lead copy: `text-base leading-7 sm:text-[1.0625rem] sm:leading-8`, or
  `sm:text-lg` on a campaign/page hero.
- Body copy: `text-sm leading-7` for supporting detail and `text-base leading-8`
  for sustained explanation.
- Eyebrow: `text-xs font-semibold tracking-[0.18em] uppercase`; a campaign MAY
  use `text-sm tracking-[0.16em]` when it needs more presence.
- Action: `text-sm font-semibold`.
- Compact metadata: `text-xs` or `text-[0.8125rem]` with normal sentence
  spacing.

Paragraphs SHOULD stay near `max-w-xl` or `max-w-2xl`. A line of prose SHOULD
not span the full site container.

## 11. Color

The default website palette is neutral and role-based:

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `bg-white` | `dark:bg-zinc-950` |
| Quiet chapter | `bg-stone-50/70` | `dark:bg-zinc-900/35` |
| Strong text | `text-zinc-950` | `dark:text-zinc-100` |
| Body text | `text-zinc-600` | `dark:text-zinc-300` |
| Muted text | `text-zinc-500` | `dark:text-zinc-400` |
| Rule/border | `border-zinc-200` | `dark:border-white/10` |
| Accent text/icon | `text-teal-700` | `dark:text-teal-300` |
| Display accent | `text-teal-600` | `dark:text-teal-300` |

Primary marketing actions use a high-contrast neutral fill with teal as a hover
or supporting signal. Teal-filled controls MAY be used when the surrounding
composition requires it, but teal MUST NOT become a default fill for every
action and icon.

Color rules:

- Color MUST communicate hierarchy, action, state, or subject matter.
- Dark mode MUST be composed intentionally; do not mechanically invert colors.
- Body text MUST meet WCAG AA contrast against its surface.
- Raw hex colors MUST NOT be introduced for general site UI.
- A signature composition or accurate product reconstruction MAY use local raw
  colors when the values are scoped to its page-owned component.
- Gradients MAY provide quiet atmosphere or depict an artifact. They MUST NOT
  carry essential text contrast or become generic neon decoration.

Registered signature palettes:

- Web Clipper may use ink blue `#172033`, paper `#f6f2e7`, and its scoped
  sky/amber browser-extension cues.
- Product reconstructions may use local warm paper and interface colors when
  those colors improve fidelity to the represented artifact.

Adding another signature palette requires updating this list first.

## 12. Surfaces, separators, radius, and shadow

The site is primarily structured by open space, type, and alignment. Separators
— including borders, rules, and divider lines — are structural tools that MUST
be used conservatively. They may establish or reinforce a meaningful boundary,
but they MUST NOT become automatic visual rhythm. Use the smallest number that
keeps the composition clear.

- Prefer whitespace, alignment, indentation, typography, or a meaningful
  chapter background for ordinary grouping. A separator MAY be the clearer
  choice for an important transition or a dense structure.
- A separator MUST clarify a real boundary: a dense repeated row, a change of
  context, a table-like comparison, or the edge of an interactive or product
  artifact.
- A separator SHOULD NOT appear when removing it leaves the grouping and reading
  order equally clear.
- Do not place rules between every marketing section or every item by default.
  Repeated separators are acceptable only when the content genuinely reads as a
  list, ledger, timeline, table, or comparable data structure.
- Avoid stacking several boundary signals on the same transition. If spacing or
  a quiet background already marks a chapter, a full-width rule is usually
  unnecessary.
- During critique, temporarily remove each non-artifact separator. Restore it
  when it materially improves a boundary, association, scanning, or reading
  order; otherwise leave it out.
- Use a quiet background to mark a chapter, not to decorate every section.
- Use shadow mainly to establish the physical depth of a browser, window, or
  product artifact.
- General marketing content SHOULD NOT float above the page in elevated cards.

Radius roles:

| Role | Treatment |
| --- | --- |
| Buttons and compact controls | `rounded-lg` |
| Small panels and nested product UI | `rounded-xl` |
| Major product frames and true card surfaces | `rounded-2xl` |
| Avatars, status dots, and compact icon medallions | `rounded-full` |

Pill shapes MUST be reserved for compact statuses, versions, filters, or other
content whose form communicates a small bounded value. They MUST NOT be used for
ordinary headings, navigation, or decorative labels.

## 13. Actions, links, and icons

### 13.1 Action hierarchy

- A hero MUST have no more than one primary and one secondary action.
- A section SHOULD have one next action. Additional destinations become text
  links or belong in navigation.
- Labels MUST use a specific verb and object: `Install Memos`, `Try Live Demo`,
  `Add to Chrome`, or `Read the changelog`.
- `Learn more`, `Get started`, and `Submit` SHOULD NOT be used when a more
  specific action is available.
- External actions MUST use safe external-link attributes.

Standard marketing pages SHOULD use `MarketingActionLink` and
`MarketingActions`. A signature hero MAY own its action markup when contrast or
artifact context requires it, but it MUST preserve the established height,
radius, type weight, focus treatment, and action hierarchy.
Actions placed on an always-dark chapter MUST use the shared inverse tone; dark
mode variants alone do not provide contrast when the visitor is using the light
theme.

### 13.2 Interaction

- Every interactive element MUST expose a visible keyboard focus state.
- Hover MAY shift an arrow or lift a bounded object by no more than four pixels.
- Hover MUST NOT be the only way information or state is communicated.
- Link and button targets MUST remain usable when text wraps or the viewport is
  narrow.

### 13.3 Icons

- Use Lucide icons with the `XxxIcon` import convention.
- Icons MUST clarify a real action, object, or category.
- Marketing copy MUST NOT use emoji as interface iconography.
- Repeated generic sparkles, rockets, lightning, or magic-wand decoration MUST
  NOT substitute for product evidence.

## 14. Product presentation

The public site proves the product; it does not redesign the product.

- Prefer a truthful product reconstruction, screenshot, Markdown sample,
  browser context, or command over an abstract illustration.
- Crop and scale the artifact around the claim being explained.
- Show enough chrome to establish context, but do not let browser or window
  chrome become the subject.
- Product copy, controls, and data shown inside a reconstruction MUST be
  plausible and internally consistent.
- Product-interface colors may remain inside the artifact. They MUST NOT leak
  into the surrounding website palette without a registered signature rule.
- Static decorative reconstructions SHOULD be hidden from assistive technology;
  informative images MUST have useful alternative text or an adjacent text
  explanation.
- Do not fabricate usage statistics, testimonials, integrations, customers, or
  product behavior.

Website product visuals belong in `src/features/marketing/components/` or a
page-specific marketing folder. They MUST NOT be placed in product feature
folders or treated as product UI primitives.

## 15. Editorial surfaces

Blog and Changelog are part of the website system. Docs are not.

- Editorial indexes SHOULD use a narrow inner measure near `48rem` inside the
  `site-container`.
- Lists SHOULD expose title, description, metadata, and reading action through
  type and spacing rather than card chrome.
- Article prose MUST use `typeset-editorial`.
- Source Serif carries article headings; Inter carries body copy and metadata.
- Code, images, and blockquotes MAY have bounded surfaces when the content type
  requires it.
- Calls to action MUST not interrupt the reading flow before the article has
  delivered its value.

Fumadocs layout, navigation, interactions, and `typeset-docs` are outside this
system.

## 16. Content and voice

Words are part of the composition.

- Write from the visitor's side of the screen in direct, active language.
- State what Memos does, what the visitor controls, and what evidence supports
  the claim.
- Prefer concrete nouns and verbs over category jargon.
- Keep headings short enough to carry hierarchy without becoming slogans made
  of filler.
- A label labels, an example demonstrates, and an action states what happens.
- Use sentence case except for short established eyebrows and metadata.
- Keep the same action name across the page.
- Explain self-hosting, privacy, Markdown, and open source through consequences,
  not empty adjectives.

Avoid inflated language such as `revolutionary`, `effortless`, `supercharge`,
`unlock`, or `the ultimate`. Avoid describing Memos as a generic workspace,
second brain, all-in-one platform, or AI productivity layer.

## 17. Motion

Motion MUST explain arrival, focus, or interaction.

- A page MAY use one orchestrated entrance for its hero copy and primary proof.
- Entrance motion SHOULD finish within 800ms and use an ease-out curve.
- Repeated ambient motion MUST be subtle, sparse, and tied to an artifact, such
  as a caret, selection, or save action.
- Do not add scroll-jacking, parallax, cursor followers, auto-rotating carousels,
  or unrelated floating objects.
- `prefers-reduced-motion: reduce` MUST disable non-essential animation and
  smooth scrolling.
- Content MUST remain complete and visible when animation does not run.

## 18. Responsive behavior

Responsive design preserves the argument, not the desktop geometry.

- Start with the mobile reading order.
- Stack hero actions on narrow screens and allow full-width action targets when
  that improves usability.
- Collapse a split composition so copy precedes the proof unless the proof is
  necessary to understand the claim.
- Remove forced single-line title behavior before it causes overflow.
- Reduce decorative depth, offsets, or overlaps before reducing legibility.
- Product reconstructions MAY crop secondary chrome on mobile but MUST retain the
  interaction or information being proved.
- Test at 320 CSS pixels even when the primary visual review uses a wider mobile
  viewport.

## 19. Dark mode and accessibility

Dark mode and accessibility are release requirements, not later refinements.

- Every new site color and visual state MUST define a dark-mode treatment.
- Text and interactive controls MUST meet WCAG AA contrast.
- Focus order MUST match the visual and reading order.
- Use semantic landmarks and one logical `h1` per page.
- Headings MUST not skip levels to achieve a visual size.
- Controls MUST retain an accessible name without relying on an icon.
- Information MUST not depend on color, motion, hover, or pointer precision
  alone.
- Decorative visuals MUST be ignored by assistive technology.
- Meaningful media MUST have useful alternative text or an equivalent adjacent
  explanation.

## 20. Prohibited defaults

Agents MUST reject these patterns unless this document explicitly requires them
for a named context:

- a generic centered hero followed by a uniform card grid and centered CTA
- bento grids used only to make ordinary feature copy look designed
- cards around every paragraph, statistic, icon, or navigation item
- decorative numbered labels when the content is not an ordered sequence
- oversized display text that hides the page's proof below a viewport-height
  hero
- glassmorphism, neon gradients, or glow effects unrelated to the subject
- multiple competing accent colors across ordinary site UI
- pill-shaped containers used as general decoration
- repeated separator lines used as decoration or as the default boundary
  between every section and item
- fabricated dashboards, charts, metrics, logos, quotes, or customer evidence
- animation distributed across every section instead of one meaningful moment
- a new local button, heading scale, or container width created only to avoid a
  shared primitive
- copying the Homepage composition into every page
- copying Web Clipper's campaign palette into unrelated pages
- reusing an identical hero composition across unrelated pages solely because a
  shared component can accept different copy

## 21. Verification and tests

A page is not compliant until automated checks and visual inspection both pass.

### 21.1 Automated verification

For every website design-system change, the agent MUST:

1. Add or update tests for each machine-verifiable rule introduced or changed.
2. Run `pnpm test`.
3. Run `pnpm lint`.
4. Run `pnpm build` when the change affects shared tokens, shared components,
   route rendering, metadata, or production behavior.
5. Confirm through the diff that no excluded App, Auth, or Docs surface changed
   unintentionally.

`src/features/marketing/site-layout-boundary.test.ts` is the model for static
conformance tests. Tests SHOULD enforce durable boundaries such as container
ownership, prohibited outer widths, content-sized heroes, registered tokens,
and safe shared-component usage. They SHOULD NOT freeze an entire Tailwind class
string or prevent legitimate content-shaped composition.

If a rule is machine-verifiable, prose verification alone is insufficient.

### 21.2 Visual verification

The agent MUST inspect the rendered result at minimum in:

- a desktop viewport at or above 1280 CSS pixels
- a mobile viewport near 390 CSS pixels
- light mode
- dark mode

The inspection MUST cover:

- hierarchy and reading order
- section rhythm and alignment
- title wrapping and text measure
- separator density; every visible rule must clarify a boundary that spacing,
  alignment, or type cannot communicate as clearly
- product-artifact accuracy and cropping
- action hierarchy and keyboard focus
- hover and reduced-motion behavior
- overflow at 320 CSS pixels
- the relationship to the Homepage and Web Clipper references

The goal of comparison is shared judgment, not visual sameness.

## 22. Extending the system

When the system cannot express a legitimate new website need, the agent MUST:

1. Identify and describe the gap.
2. Update this document before implementing the page.
3. Add or extend the corresponding token, primitive, pattern, archetype, or
   signature registration.
4. Implement the page using the updated rule.
5. Verify that the addition can support comparable future content instead of
   serving only the current page.
6. Add tests for every machine-verifiable requirement.

Agents MUST NOT create a local workaround first and document it afterward.

A durable user-requested exception MUST be recorded in this document with its
route, scope, reason, and affected rule. There are currently no standing user
exceptions. Registered page signatures are part of the system and are not
exceptions.

## 23. Migration

The Homepage and Web Clipper are the initial reference implementations. They are
not frozen; they MAY be refined when the change makes the documented system more
coherent without erasing their individual composition.

All other public `(site)` pages are migration targets. Migration SHOULD proceed
in this order:

1. Shared site chrome, actions, headings, containers, and section primitives
2. Feature, Use Case, Compare, and Pricing indexes
3. Their detail pages
4. Blog and Changelog indexes and articles
5. Sponsors, Brand, Privacy, and other utility pages

Each migration MUST preserve route behavior, metadata, structured data, dark
mode, responsive behavior, and content accuracy. Migration work MUST NOT expand
into Docs, App, or Auth.

The system is successful when another agent can create or migrate a public page
without inventing a new visual language, while the resulting page still has a
composition specific to its subject.

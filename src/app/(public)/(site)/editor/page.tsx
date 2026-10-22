import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { EditorInstallCommand } from "@/features/marketing/components/editor-install-command";
import { EditorPlayground } from "@/features/marketing/components/editor-playground";
import { CodeFrame, PreservedSourceFigure, ShortcutLedger, SizeComparison } from "@/features/marketing/components/editor-showcase";
import styles from "@/features/marketing/components/editor-showcase.module.css";
import {
  EDITOR_ARCHITECTURE_DOC_URL,
  EDITOR_GITHUB_URL,
  EDITOR_LICENSE_URL,
  EDITOR_NPM_URL,
  EDITOR_PACKAGE_NAME,
  EDITOR_REACT_SNIPPET,
  EDITOR_README_URL,
  EDITOR_SIZE_MEASURED_ON,
  EDITOR_SYNTAX_DOC_URL,
  EDITOR_THEME_SNIPPET,
  EDITOR_VANILLA_SNIPPET,
  EDITOR_VERSION,
} from "@/features/marketing/data/editor";
import {
  absoluteUrl,
  BASE_URL,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildMarketingMetadata,
  type FaqItem,
  SITE_NAME,
} from "@/shared/lib/seo";
import { JsonLdScript } from "@/shared/ui/json-ld-script";

// The raw-Markdown voice of this page. Scoped to the route through a CSS variable.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-editor-mono",
});

const PAGE_TITLE = "Memos Editor - A Block Editor for Markdown";
const PAGE_DESCRIPTION =
  "Try the open-source block editor inside Memos, for React or any web app. Slash menu, toolbar and shortcuts on top; CommonMark and GFM, saved byte for byte.";
const OG_IMAGE_URL = `${BASE_URL}/og/editor/image.png`;

const baseMetadata = buildMarketingMetadata({ title: PAGE_TITLE, description: PAGE_DESCRIPTION, path: "/editor" });

export const metadata: Metadata = {
  ...baseMetadata,
  keywords: ["markdown editor", "block editor", "react markdown editor", "commonmark", "gfm", "wysiwyg markdown", "open source editor"],
  openGraph: {
    ...baseMetadata.openGraph,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: `${PAGE_TITLE} - ${SITE_NAME}` }],
  },
  twitter: {
    ...baseMetadata.twitter,
    images: [OG_IMAGE_URL],
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { href: "/", name: "Home" },
  { href: "/editor", name: "Editor" },
]);

const sourceCodeJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: EDITOR_PACKAGE_NAME,
  alternateName: "Memos Editor",
  description:
    "A block editor for Markdown with zero runtime dependencies, for React or any web app. CommonMark and GFM in, the same Markdown out.",
  url: absoluteUrl("/editor"),
  codeRepository: EDITOR_GITHUB_URL,
  programmingLanguage: "TypeScript",
  runtimePlatform: "Web browser",
  version: EDITOR_VERSION,
  license: EDITOR_LICENSE_URL,
  downloadUrl: EDITOR_NPM_URL,
  keywords: "markdown editor, block editor, react, commonmark, gfm",
  isPartOf: { "@type": "SoftwareApplication", name: SITE_NAME, url: BASE_URL },
  author: { "@type": "Organization", name: SITE_NAME, url: BASE_URL },
};

const HERO_LINKS = [
  { label: "GitHub", href: EDITOR_GITHUB_URL },
  { label: "npm", href: EDITOR_NPM_URL },
  { label: "README", href: EDITOR_README_URL },
] as const;

const PRINCIPLES = [
  {
    title: "Markdown is the stored format",
    description: "Loading parses Markdown into blocks, and saving writes the blocks back. There is no second document format to store.",
  },
  {
    title: "Every block has a Markdown form",
    description:
      "No columns or colored text. Callouts are GitHub alerts, and collapsible sections are <details>, so anything that renders Markdown can show it.",
  },
  {
    title: "Nothing is lost on save",
    description:
      "Markdown the block model cannot hold stays as source. It is edited as text and saved verbatim, never flattened or dropped.",
  },
] as const;

/** Each feature with the keystroke or Markdown that triggers it. */
const BLOCK_FEATURES = [
  {
    specimen: "/table",
    title: "Slash menu",
    description: "Type / for headings, lists, to-dos, quotes, callouts, collapsible sections, code, tables, and dividers.",
  },
  {
    specimen: "⌘B  ⌘I  ⌘K",
    title: "Formatting toolbar",
    description:
      "Select text for bold, italic, strikethrough, code, links, quotes, code blocks, and lists. A link card opens, copies, edits, or removes a link.",
  },
  {
    specimen: "> [!tip] ",
    title: "Typing shortcuts",
    description:
      "Markdown you already know turns into blocks and marks as you type. Backspace right after a shortcut puts the characters back.",
  },
  {
    specimen: "Esc  ⌘C  ⌘V",
    title: "Block selection",
    description:
      "Escape selects whole blocks. Copy, cut, paste over, duplicate, delete, or change their type together. Tables, code blocks, and images get a handle with a block menu.",
  },
  {
    specimen: "@ad|",
    title: "Autocomplete",
    description:
      "One popup for #tags, @people, and :emoji, with async items, sections, and keyboard navigation. Your app decides the syntax and what a pick writes.",
  },
  {
    specimen: "Blocks ⇄ Source",
    title: "Source mode",
    description:
      "Switch to the document as Markdown text and back. Nothing changes, undo history survives, and Enter still continues a list.",
  },
] as const;

const EXTENSION_POINTS = [
  { title: "Math", description: "$…$ and $$ blocks through math(), rendered by a renderer you pass in, such as KaTeX." },
  { title: "Footnotes", description: "[^1] references and definitions, collected at the end when read-only, as on GitHub." },
  { title: "Tags and mentions", description: "#tag and @name highlighting with your own classes, click handlers, and grammar." },
  { title: "Files", description: "Pasted and dropped files reach your upload code, with a widget to show progress in place." },
  {
    title: "Views",
    description: "Render a syntax or a code language your way, such as a mermaid block as a diagram, or a bare link as a preview card.",
  },
  { title: "Labels and icons", description: "Every UI string is overridable for localization, and every Lucide icon can be replaced." },
] as const;

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Is this the editor Memos uses?",
    answer:
      "Yes. Memos pins @usememos/editor as a dependency and uses it to write memos. The package is maintained in the usememos/editor repository and published to npm, so any web app can use the same editor.",
  },
  {
    question: "Does it need React?",
    answer:
      "No. The core is plain TypeScript with zero runtime dependencies and works in any web app. @usememos/editor/react is a thin wrapper with a MarkdownEditor component and a useEditor hook for apps that use React 18 or later.",
  },
  {
    question: "Which Markdown does it read and write?",
    answer:
      "CommonMark 0.31.2 plus the GFM extensions for tables, task lists, strikethrough, and autolink literals, GitHub alerts as callouts, and <details> as collapsible sections. All 652 CommonMark spec examples and the GFM spec examples produce the reference HTML. Math, footnotes, tags, and mentions are extensions.",
  },
  {
    question: "What happens to Markdown the editor cannot represent?",
    answer:
      "It is kept as a raw block: shown and edited as source and saved verbatim. Every block you do not edit is saved byte for byte, and loading and saving without edits returns the input unchanged.",
  },
  {
    question: "How large is it?",
    answer: `The project measured the core at about 56 KB minified and gzipped, with the React wrapper adding 1.3 KB and the stylesheet 3.5 KB, on ${EDITOR_SIZE_MEASURED_ON}. The optional emoji list is 18 KB and loads the first time the popup opens.`,
  },
  {
    question: "How is it versioned?",
    answer:
      "Releases follow the Memos calendar versioning, such as 26.10.0 for the first release in October 2026. Versions do not signal breaking changes, so pin an exact version and read the commit log for changes marked as breaking.",
  },
  {
    question: "Is the editor open source?",
    answer:
      "Yes. Like Memos itself, the editor is MIT-licensed. The code, the Markdown syntax specification, and the architecture notes are on GitHub.",
  },
] as const;

const faqJsonLd = buildFaqJsonLd(FAQ_ITEMS);

export default function EditorPage() {
  return (
    <main className={`${plexMono.variable} ${styles.page} flex flex-1 flex-col overflow-hidden`}>
      <JsonLdScript data={breadcrumbJsonLd} />
      <JsonLdScript data={sourceCodeJsonLd} />
      <JsonLdScript data={faqJsonLd} />

      <section className={`${styles.paper} pt-10 pb-16 sm:pt-12 lg:pt-16 lg:pb-24`}>
        <div className="site-container">
          <div className={styles.heroCopy}>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <span className={styles.spec} translate="no">
                {EDITOR_PACKAGE_NAME}@{EDITOR_VERSION}
              </span>
              <nav aria-label="Editor links" className="flex flex-wrap gap-x-5 text-sm">
                {HERO_LINKS.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <h1 className={`${styles.heading} mt-10 text-[2.75rem] sm:text-6xl lg:mt-12 lg:text-7xl`}>
              <span className={styles.mark} aria-hidden="true">
                #
              </span>
              Blocks to write in.
              <br className="hidden sm:block" /> Markdown to keep.
            </h1>

            <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[minmax(0,38rem)_minmax(0,24rem)] lg:items-end lg:justify-between lg:gap-16">
              <p className="min-w-0 max-w-[38rem] text-pretty text-base leading-7 sm:text-lg sm:leading-8">
                The open-source editor inside Memos, packaged for any web app. Write with a slash menu, a toolbar, and the Markdown
                shortcuts you already know. What it saves is plain Markdown, and the parts you did not touch come back exactly as they went
                in.
              </p>
              <div className="min-w-0">
                <EditorInstallCommand />
                <p className={`${styles.muted} mt-3 text-sm leading-6`}>
                  Works in React 18 and later, or without a framework. MIT licensed, with no runtime dependencies.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-14">
            <EditorPlayground />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-20">
          <div>
            <h2 className={`${styles.heading} text-[2.5rem] sm:text-5xl`}>Nothing is lost on save.</h2>
            <p className="mt-5 text-base leading-8">
              A block editor whose storage format is Markdown. A block you did not edit is written exactly as it was loaded, down to the
              list marker and the heading style, so the file you opened is the file you get back.
            </p>
            <dl className="mt-10 grid gap-7">
              {PRINCIPLES.map((principle) => (
                <div key={principle.title}>
                  <dt className="text-base font-semibold tracking-tight">{principle.title}</dt>
                  <dd className={`${styles.muted} mt-2 text-sm leading-7`}>{principle.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:pt-2">
            <PreservedSourceFigure />
          </div>
        </div>
      </section>

      <section className={`${styles.paper} py-16 sm:py-20 lg:py-24`}>
        <div className="site-container">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-end lg:gap-20">
            <h2 className={`${styles.heading} text-[2.5rem] sm:text-5xl`}>A block editor after parsing.</h2>
            <p className="max-w-2xl text-base leading-8 lg:justify-self-end">
              Whole blocks can be selected, moved, and changed together. A feature is added only when its result can be written as Markdown
              that GitHub would render the same way.
            </p>
          </div>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {BLOCK_FEATURES.map((feature) => (
              <div key={feature.title}>
                <code className={styles.specimen} translate="no">
                  {feature.specimen}
                </code>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className={`${styles.muted} mt-2 text-sm leading-7`}>{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h3 className={`${styles.heading} text-3xl sm:text-4xl`}>Shortcuts you already know.</h3>
              <p className={`${styles.muted} mt-4 text-sm leading-7`}>
                Typed at the start of a line, or around a word. Undo restores the characters, and they are saved escaped so they stay text.
              </p>
              <a
                href={EDITOR_SYNTAX_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.link} mt-6 inline-block text-sm`}
              >
                Read the syntax specification
              </a>
            </div>
            <div className="max-w-2xl">
              <ShortcutLedger />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.ink} py-20 sm:py-24 lg:py-28`}>
        <div className="site-container grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start lg:gap-20">
          <div className="min-w-0">
            <h2 className={`${styles.heading} text-[2.5rem] text-white sm:text-5xl`}>One package. No dependencies.</h2>
            <p className="mt-5 max-w-xl text-base leading-8">
              The core is plain TypeScript with its own CommonMark parser, serializer, and icons inside, so it adds nothing else to your
              install. The React entry is a thin wrapper over the same editor.
            </p>
            <p className="mt-10 text-sm font-semibold text-white">
              Minified and gzipped, set up for Markdown with tables, task lists, and undo
            </p>
            <div className="mt-3">
              <SizeComparison />
            </div>
            <p className={`${styles.inkMuted} mt-4 max-w-xl text-xs leading-5`}>
              Measured by the editor project on {EDITOR_SIZE_MEASURED_ON} from the npm versions of that day, React not included. The React
              wrapper adds 1.3 KB, the stylesheet 3.5 KB, and the optional emoji list 18 KB the first time it opens.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href={EDITOR_ARCHITECTURE_DOC_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Architecture notes
              </a>
              <a href={EDITOR_NPM_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Package on npm
              </a>
            </div>
          </div>
          <div className="grid gap-5">
            <CodeFrame title="React" code={EDITOR_REACT_SNIPPET} />
            <CodeFrame title="No framework" code={EDITOR_VANILLA_SNIPPET} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="site-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start lg:gap-20">
          <div>
            <h2 className={`${styles.heading} text-[2.5rem] sm:text-5xl`}>Your theme, your syntax.</h2>
            <p className="mt-5 max-w-xl text-base leading-8">
              Every color, font, and size is a CSS custom property, set from JavaScript or in a stylesheet, with a light and a dark value.
              The editor has no border or background of its own, so it sits inside your card, comment box, or chat input. The playground
              above follows this site&apos;s variables the same way.
            </p>
            <CodeFrame title="theme.css" code={EDITOR_THEME_SNIPPET} className="mt-8 max-w-xl" />
          </div>
          <dl className="grid gap-7 sm:grid-cols-2 lg:grid-cols-1 lg:pt-2">
            {EXTENSION_POINTS.map((point) => (
              <div key={point.title}>
                <dt className="text-base font-semibold tracking-tight">{point.title}</dt>
                <dd className={`${styles.muted} mt-1.5 text-sm leading-7`}>{point.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${styles.paper} py-16 sm:py-20 lg:py-24`}>
        <div className="site-container grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className={`${styles.heading} max-w-[12ch] text-4xl`}>Before you add it.</h2>
            <a href={EDITOR_GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${styles.link} mt-6 inline-block text-sm`}>
              View the source on GitHub
            </a>
          </div>

          <dl>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="border-t border-[var(--ed-line)] py-8 first:border-t-0 first:pt-0 last:pb-0 lg:py-10">
                <dt className="text-base font-semibold tracking-tight sm:text-lg">{item.question}</dt>
                <dd className={`${styles.muted} mt-3 max-w-2xl text-sm leading-7 sm:text-[0.98rem]`}>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the official website for Memos (usememos.com), built with Next.js, TypeScript, and Tailwind CSS. It serves as marketing site, documentation hub, blog, and features showcase.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Content**: Fumadocs for documentation, MDX for blogs/changelogs
- **Styling**: Tailwind CSS 4.x with custom design system
- **Icons**: Lucide React (use XxxIcon naming convention)
- **Database**: File-based content (MDX files in `/content/`)

## Development Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Development server with turbo
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Process MDX content (runs automatically on install)
pnpm postinstall
```

## Architecture

### Page Structure
- `app/(home)/` - Marketing homepage with features/stats
- `app/docs/` - Documentation using Fumadocs
- `app/blog/` - Blog posts from `/content/blog/`
- `app/changelog/` - Release notes from `/content/changelog/`  
- `app/features/` - SEO feature pages with individual `/features/[slug]` routes
- `app/brand/`, `app/privacy/`, `app/supporters/` - Static marketing pages

### Content Management
- **Documentation**: MDX files in `/content/docs/` with frontmatter schemas
- **Blog Posts**: MDX files in `/content/blog/` with author, date, tags
- **Changelogs**: MDX files in `/content/changelog/` with version, features, fixes
- **Configuration**: `source.config.ts` defines MDX schemas and processing

### Component System
- **Marketing Components**: `/components/feature-card.tsx`, `/components/stats-card.tsx`
- **UI Components**: `/components/ui/` (Card, Callout, CodeBlock, Steps)
- **Layout**: Fumadocs provides docs layout, custom HomeLayout for marketing

### Styling Patterns
- Follow Supernotes.app aesthetic - gradients, rounded corners, modern spacing
- Use `py-24` for section padding, `rounded-2xl` for cards
- Teal/cyan color scheme (`teal-600`, `cyan-600`) for primary actions
- Dark mode support throughout with `dark:` prefixes

### Feature Pages System
Individual SEO pages at `/features/[slug]` with comprehensive feature definitions including:
- Hero sections with titles/subtitles
- Benefits lists with CheckCircle icons
- Use cases with StarIcon
- Technical details in gradient cards

## Key Conventions

### Icon Usage
- Import Lucide icons with XxxIcon naming: `import { ShieldIcon } from "lucide-react"`
- Pass icons as React elements to components, not strings

### MDX Components
- Custom components available in MDX: Card, Cards, Callout, CodeBlock
- Register new components in `/src/mdx-components.tsx`

### Metadata & SEO
- Comprehensive OpenGraph tags on all pages
- Twitter card support
- Feature pages optimized for search with detailed descriptions

## Content Guidelines

- Remove emojis from marketing content (replaced with Lucide icons)
- Use consistent gradient backgrounds and shadow patterns
- Maintain responsive design with mobile-first approach
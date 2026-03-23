# Astro v6 Template - Project Guidelines

## Project Purpose

Lean, production-ready Astro v6 monorepo template with two use cases: Starter (landing page + contact) and Blog (MDX + Content Collections).

## Architecture

### Monorepo Structure
```
apps/
  starter/    # Landing page + contact form + i18n
  blog/       # Blog with MDX, Content Collections, RSS

shared/       # Design tokens, components, layouts, SEO, utilities

e2e/
  starter/    # Playwright E2E tests for starter
  blog/       # Playwright E2E tests for blog
```

### Dependency Rules
- Apps only import from `@astro-v6/shared`
- NO cross-imports between apps/

## Tech Stack

- **Astro v6** (Beta) - Vite Environment API, Live Collections, CSP
- **Node >= 22.12.0** - Required for Astro v6
- **Tailwind v4** - CSS-first, Vite plugin, OKLCH
- **Svelte 5** - Runes ($state, $derived) for reactive islands
- **Zod v4** - z.email() instead of z.string().email(), z.url() instead of z.string().url()
- **Biome** - Single tool for linting + formatting (no ESLint/Prettier)
- **Playwright** - E2E tests for both apps with axe-core a11y scanning
- **pnpm** - Workspaces with catalog for centralized dependency management

## Code Conventions

### TypeScript
- Strict mode always enabled
- No `any` types (warn level)
- Export `interface Props` in Astro components
- Zod v4 syntax: `z.email()`, `z.url()`, `z.uuid()` (top-level)

### Astro v6 Breaking Changes
- `render(entry)` instead of `entry.render()` for Content Collections
- `getEntry()` instead of `getEntryBySlug()`
- `entry.id` instead of `entry.slug`
- `src/content.config.ts` instead of `src/content/config.ts`
- Loader API: `glob()` loader for local collections
- `<ClientRouter />` instead of `<ViewTransitions />`
- `import.meta.glob()` instead of `Astro.glob()`
- `import { z } from 'astro/zod'` (not from `astro:content`)

### Components
- PascalCase for file names
- Semantic HTML (nav, main, article, section)
- WCAG 2.1 Level AA compliance (see Accessibility section below)
- Mobile-first, dark mode support

### Accessibility (WCAG 2.1 Level AA)
- Contrast ratio >= 4.5:1 for normal text, >= 3:1 for large text
- All interactive elements keyboard-accessible with visible `:focus-visible` outline
- Skip link to `#main` on every page
- Semantic HTML landmarks: `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`
- ARIA labels on icon-only buttons and navigation landmarks
- Form inputs: associated `<label>`, `aria-invalid` on errors, `aria-describedby` linking to error messages with `role="alert"`
- Links distinguishable by underline (not color alone) per WCAG 1.4.1; use `no-underline` on button-style links and navigation
- Images require `alt` text (decorative images: `alt=""`)
- Page language set via `lang` attribute on `<html>`
- Single `<h1>` per page, heading hierarchy without skipping levels
- Error pages use `role="alert"` for screen reader announcement
- Automated a11y testing via `@axe-core/playwright` in E2E suite

### Styling
- Prefer Tailwind utility classes
- CSS custom properties for design tokens
- OKLCH colors for consistent color rendering
- Scoped styles in Astro/Svelte only when necessary

### Biome (no ESLint/Prettier)
- `biome check .` for lint + format
- `biome check --write .` for autofix
- Supports .js, .ts, .json, .astro, .svelte, .css

## i18n

- Default locale `en` at root (`/`, `/contact`), secondary locale `de` with prefix (`/de/`, `/de/contact`)
- `prefixDefaultLocale: false` in Astro i18n config
- Translation files per app: `src/i18n/en.ts`, `src/i18n/de.ts`, `src/i18n/index.ts`
- Shared locale utilities in `shared/src/utils/i18n.ts` (`localePath`, `switchLocalePath`, `useTranslations`)
- Language switcher as simple EN/DE link in Navbar

## OG Image Generation

- Build-time generation via `scripts/generate-og.ts` (runs before `astro build`)
- Uses Satori (HTML→SVG) + @resvg/resvg-js (SVG→PNG) — native Node.js, not WASM
- Output: `public/og/*.png` (1200x630, gitignored)
- Blog script reads MDX frontmatter automatically for post-specific images
- Wired into `<PageSEO ogImage={...}>` on all pages with absolute URLs via `Astro.site`

## Astro Actions

- Located in `src/actions/` with `index.ts` as re-export hub
- Split into separate files: `contact.ts`, `newsletter.ts`, `feedback.ts`
- Convention: `export const server = { submitContactForm, subscribeNewsletter, submitFeedback }`

## E2E Tests

- Playwright at workspace root, tests in `e2e/starter/` and `e2e/blog/`
- Static file server (`serve`) for testing built output
- Run: `pnpm test:e2e`, `pnpm test:e2e:starter`, `pnpm test:e2e:blog`
- Covers: navigation, i18n, SEO/OG meta tags, contact form, theme toggle, RSS, a11y (axe-core), robots.txt, sitemap

## Security
- Content Security Policy (CSP) with SHA-256 algorithm
- Server-side sessions via Cloudflare KV (`sessionKVBindingName: 'SESSION'`)
- `checkOrigin: true` for CSRF protection
- Zod validation for all inputs (env, forms, API)
- No `set:html` without sanitization
- API routes: always try/catch + Zod schema

## Claude Skills

Detailed development guidelines are available as skills under `.claude/skills/`:

- **astro-v6** — Astro v6 API, Content Collections, Zod v4, component patterns
- **client-scripts** — `<script>` vs `is:inline`, bundling, FOUC prevention, SPA events
- **tailwind-v4** — Tailwind v4 syntax, design tokens, dark mode, CSS-first config
- **svelte-5** — Runes API ($state, $derived, $effect), event handlers, props
- **playwright** — E2E test patterns, axe-core a11y, multi-project config
- **cloudflare** — Workers deploy, wrangler, KV bindings, sessions, adapter
- **i18n** — Translations, locale routing, adding pages/locales
- **biome** — Lint/format config, pre-commit hooks, known quirks
- **mdx-content** — Content Collections, Loader API, blog posts, RSS
- **seo** — OG images, PageSEO component, sitemap, robots.txt, JSON-LD
- **local-business-seo** — LocalBusiness JSON-LD, geo meta tags, areaServed, regionale Keywords
- **wcag-a11y** — WCAG 2.2 AA patterns: landmarks, forms, focus, contrast, ARIA, motion, dialogs, checklists
- **darkmode** — Dark mode implementation: class-based toggle, cookie persistence, color guidelines, FOUC prevention
- **performance** — Core Web Vitals, image optimization, content-visibility, scroll-driven animations
- **webspire** — Webspire MCP integration: UI patterns, CSS snippets, design tokens, glass effects

## Webspire MCP

[Webspire](https://www.webspire.de) provides curated UI patterns and CSS snippets via MCP.

### Setup
- MCP server configured in `.claude/mcp.json` (`@webspire/mcp`)
- Query patterns: `search_patterns`, `get_pattern` (hero, pricing, faq, tabs, cards, steps)
- Query snippets: `search_snippets`, `get_snippet` (glass, scroll, hover, easing)
- Brand mapping: `recommend_token_mapping` generates CSS tokens from your brand colors

### Token Integration
1. Use `setup_tokens` to generate base token CSS
2. Override `--ws-color-primary`, `--ws-color-accent` etc. with your brand colors
3. Webspire patterns automatically inherit your brand via CSS custom properties

### Available CSS Snippets
Commonly used classes: `.scroll-reveal`, `.hover-lift`, `.shine-sweep`, `.border-draw`, `.spotlight-card`, `.stagger-children`

All snippets include `@media (prefers-reduced-motion: reduce)` handlers.

## View Transitions (ClientRouter)

### Script Patterns
- **Module `<script>`** — runs once, persists across navigations. Use `astro:page-load` for re-initialization.
- **`<script is:inline>`** — re-runs on every navigation. No TypeScript allowed.
- **`data-astro-rerun`** — forces re-execution. Implies `is:inline`. Use IIFE for fresh DOM refs.

### Common Mistakes
| Mistake | Fix |
|---------|-----|
| `astro:page-load` + `data-astro-rerun` together | Choose one — both causes double execution |
| TypeScript in `is:inline` scripts | Remove type annotations, use plain JS |
| `classList.add('a b')` (space in string) | Use `classList.add('a', 'b')` (separate args) |
| document-level listeners without cleanup | Store on `window.__handler`, remove before re-adding |

## Dark Mode

Class-based via `.dark` on `<html>`. Persisted via cookie (cross-subdomain) + localStorage.

### Key Principles
- Warm tones, not cold grays
- No pure black (`#000`) or pure white (`#fff`)
- Adjust accent colors for dark surfaces (lighten or warm up)
- Use `:global(html.dark)` in scoped Astro styles
- All animations must support `prefers-reduced-motion: reduce`

See `/darkmode` skill for complete implementation guide.

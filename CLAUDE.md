# Astro v6 Template - Project Guidelines

## Project Purpose

Lean, production-ready Astro v6 monorepo template with two use cases: Starter (landing page + contact) and Blog (MDX + Content Collections).

## Architecture

### Monorepo Structure
```
apps/
  starter/    # Minimal landing page + contact form
  blog/       # Blog with MDX, Content Collections, RSS

packages/
  styles/     # Design tokens (CSS variables, OKLCH)
  ui/         # Shared components (layouts, navbar, SEO, ThemeToggle)
  utils/      # Shared utilities (env, api, cn)
```

### Dependency Rules
- Apps only import from packages/
- Packages do NOT import from each other (exception: utils -> external deps only)
- NO cross-imports between apps/

## Tech Stack

- **Astro v6** (Beta) - Vite Environment API, Live Collections, CSP
- **Node >= 22.12.0** - Required for Astro v6
- **Tailwind v4** - CSS-first, Vite plugin, OKLCH
- **Svelte 5** - Runes ($state, $derived) for reactive islands
- **Zod v4** - z.email() instead of z.string().email(), z.url() instead of z.string().url()
- **Biome** - Single tool for linting + formatting (no ESLint/Prettier)
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
- WCAG 2.1 Level AA: contrast >= 4.5:1, keyboard navigation, ARIA
- Mobile-first, dark mode support

### Styling
- Prefer Tailwind utility classes
- CSS custom properties for design tokens
- OKLCH colors for consistent color rendering
- Scoped styles in Astro/Svelte only when necessary

### Biome (no ESLint/Prettier)
- `biome check .` for lint + format
- `biome check --write .` for autofix
- Supports .js, .ts, .json, .astro, .svelte, .css

## Security
- Zod validation for all inputs (env, forms, API)
- No `set:html` without sanitization
- API routes: always try/catch + Zod schema

## Claude Skills

Detailed development guidelines are available as skills under `.claude/skills/`:

- **astro-v6** - Astro v6 API, Content Collections, Zod v4, component patterns
- **tailwind-v4** - Tailwind v4 syntax, design tokens, dark mode, CSS-first config

# Roadmap

## Phase 1: Foundation (current)

- [x] Monorepo structure with pnpm Workspaces + Catalog
- [x] Shared packages: styles, ui, utils
- [x] Starter app: Landing page + contact form + API route
- [x] Blog app: MDX + Content Collections (Loader API) + RSS
- [x] Design tokens with OKLCH colors (light/dark)
- [x] Biome as single lint/format tool
- [x] CI pipeline (GitHub Actions)
- [x] CLAUDE.md project guidelines
- [x] Zod v4 integration (env, api, forms)

## Phase 2: Astro v6 Stable

- [ ] Upgrade to Astro v6 stable (once released)
- [ ] Enable Content Security Policy (CSP)
- [ ] Add Live Content Collections example
- [ ] Add `<ClientRouter />` for view transitions
- [ ] Astro Sessions example (e.g. shopping cart demo)
- [ ] Update catalog versions to stable releases

## Phase 3: DX & Tooling

- [ ] Image optimization script (Sharp-based, ported from v5)
- [ ] Build validation script (config check before build)
- [ ] Improve Biome Astro/Svelte support (once stable)
- [ ] Lighthouse CI integration
- [ ] Bundle analysis script

## Phase 4: Extensions

- [ ] Cloudflare Workers adapter example
- [ ] i18n setup (en/de) with Astro v6 i18n routing
- [ ] Contact form with real backend (e.g. Resend)
- [ ] Newsletter signup component
- [ ] Sitemap generation (custom + @astrojs/sitemap)
- [ ] OpenGraph image generation

## Phase 5: Testing & Quality

- [ ] Playwright E2E tests for both apps
- [ ] Accessibility audit automation (axe-core)
- [ ] Visual regression tests
- [ ] Define performance budgets

## Not Planned (intentionally omitted)

- **No demo showcase** — Only practical use cases
- **No 16 font packages** — 3 fonts are enough (Inter, Lora, Fira Code)
- **No @casoon/atlas** — Custom, lean design tokens
- **No ESLint/Prettier** — Biome covers everything
- **No map/animation/typography demos** — Focus on core features

## Astro v6 Features to Watch

Features we will integrate once they are stable:

| Feature | Status | Planned for |
|---|---|---|
| Vite Environment API | Beta | Phase 1 (done) |
| Content Collections Loader | Beta | Phase 1 (done) |
| Zod v4 | Beta | Phase 1 (done) |
| CSP support | Beta (stable in v6) | Phase 2 |
| Live Collections | Beta (stable in v6) | Phase 2 |
| Client Router | Stable | Phase 2 |
| Sessions API | Experimental | Phase 2 |
| Cloudflare workerd | Beta | Phase 4 |

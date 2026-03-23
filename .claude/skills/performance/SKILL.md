---
name: performance
description: Performance optimization patterns for Astro sites. Use this skill when optimizing page load, reducing bundle size, improving Core Web Vitals, or diagnosing slow pages.
---

# Performance Optimization

## Image Optimization

### Responsive Images
Generate responsive variants for different viewports:
```bash
# Example script pattern
node scripts/generate-responsive-images.js --filter=image-name
```
Output: `{name}-378w.webp`, `{name}-756w.webp`, `{name}.webp`

### Lazy Loading
```html
<img src="image.webp" loading="lazy" decoding="async" alt="..." />
```
Only hero/above-the-fold images should use `loading="eager"`.

### WebP Format
Always use WebP. Source images at 1024x1024 for blog teasers, 1200x630 for OG images.

## CSS Performance

### Content Visibility
Single-line performance win for long pages:
```css
.article-card { content-visibility: auto; contain-intrinsic-size: 0 300px; }
```
Browser skips rendering of off-screen cards. No layout shift if `contain-intrinsic-size` is set.

### CSS Containment
```css
.card { contain: layout paint style; }
```
Isolates layout/paint calculations to the element.

### Reduce Animation Cost
- Avoid `filter: blur()` on moving elements
- Use `transform: translate3d()` for GPU compositing
- Keep `will-change` to minimum necessary elements
- Prefer CSS `animation-timeline: view()` over JS scroll handlers

## JavaScript

### Minimize Client JS
Astro renders zero JS by default. Keep it that way:
- Use `<script>` only when truly needed
- Prefer CSS-only solutions (`:has()`, `<details>`, `popover`, `dialog`)
- Hydrate islands with `client:visible` or `client:idle` instead of `client:load`

### Scroll Handlers
```javascript
// Bad: runs on every scroll frame
window.addEventListener('scroll', handler);

// Better: passive + throttled
window.addEventListener('scroll', handler, { passive: true });

// Best: CSS scroll-driven animations (no JS)
.element { animation-timeline: view(); }
```

## Font Loading

```css
@import '@fontsource/inter/latin-400.css';
```
Use `@fontsource` for self-hosted fonts — no external requests, optimal caching.

### Font Display
```css
font-display: swap; /* Already set by @fontsource */
```

## Build Optimization

### Astro Post-Audit
Run `pnpm build` — `@casoon/astro-post-audit` validates assets, duplicates, and structure at build time.

### Bundle Analysis
Check Vite's build output for large chunks. Look for:
- Unintended npm packages in client bundles
- Duplicate component instances
- Large inline SVGs that should be external

## Core Web Vitals

| Metric | Target | Common Fix |
|--------|--------|-----------|
| **LCP** | < 2.5s | Preload hero image, inline critical CSS |
| **CLS** | < 0.1 | Set explicit width/height on images, `contain-intrinsic-size` |
| **INP** | < 200ms | Move work off main thread, reduce JS |

## Cloudflare-Specific

- Static assets: Automatic edge caching
- Workers: Cold start optimization via WASM or minimal JS
- Images: Use `cf-` headers for cache control

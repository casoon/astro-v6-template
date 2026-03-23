---
name: webspire
description: Webspire MCP integration for UI patterns, CSS snippets, and design tokens. Use this skill when enhancing pages with animations, glass effects, interactive patterns, or when querying the Webspire registry for components.
---

# Webspire MCP Integration

[Webspire](https://www.webspire.de) is a curated UI pattern and snippet registry. The MCP server (`@webspire/mcp`) provides direct access to patterns, snippets, and templates.

## MCP Tools

| Tool | Purpose |
|------|---------|
| `search_patterns` / `get_pattern` | UI patterns (hero, pricing, faq, tabs, cards, steps etc.) |
| `search_snippets` / `get_snippet` | CSS snippets (glass, scroll, hover, easing, surfaces etc.) |
| `search_templates` / `get_template` | Full page templates |
| `recommend_snippet` | Context-based recommendations |
| `recommend_token_mapping` | Map brand colors to Webspire tokens |
| `setup_tokens` | Generate token CSS for a brand |
| `list_pattern_families` / `list_categories` | Browse the registry |

## Token System (3 Layers)

### Layer 1: Base Tokens
Generic CSS custom properties from Webspire. Install via `setup_tokens` or copy from the registry.

```css
:root {
  --ws-color-surface: #ffffff;
  --ws-color-text: #0f172a;
  --ws-color-text-soft: #334155;
  --ws-color-primary: #4f46e5;
  --ws-color-accent: #06b6d4;
  /* ... semantic, radius, shadow tokens */
}
```

### Layer 2: Brand Mapping
Override base tokens with your brand colors:

```css
:root {
  --ws-color-primary: #your-brand-color;
  --ws-color-accent: #your-accent-color;
  --ws-color-surface: #your-background;
}
```

Use `recommend_token_mapping` to generate this from your brand palette.

### Layer 3: Component Tokens
Patterns use component-scoped tokens that inherit from base tokens:

```css
.ws-hero { --ws-hero-bg: var(--ws-color-surface); }
.ws-faq { --ws-faq-bg: var(--ws-color-surface); }
```

## Common CSS Snippets

### Scroll Reveal
```css
.scroll-reveal {
  animation: scroll-reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 30%;
}
```
Use: Add `.scroll-reveal` class to sections that should fade in on scroll.

### Hover Lift
```css
.hover-lift {
  transition: transform 0.25s var(--ease-spring), box-shadow 0.25s var(--ease-spring);
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px oklch(0 0 0 / 0.2);
}
```
Note: Parent containers need `padding-bottom: 1.5rem` for shadow visibility.

### Shine Sweep
Shimmer effect on hover. Add `.shine-sweep` class to cards.

### Border Draw
Animated border drawing from corners. Add `.border-draw` class. Trigger programmatically via `.is-drawing`.

### Spotlight Card
Radial light follows cursor. Set `--spotlight-x/y` via JS `onmousemove`.

### Stagger Children
Sequential fade-in of child elements. Add `.stagger-children` to parent.

## Easing Tokens
```css
:root {
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

## Pattern Integration

When using Webspire patterns in Astro components:

1. **Query the MCP** for pattern HTML/CSS
2. **Adapt to Astro** — convert to `.astro` component with Props interface
3. **Use Tailwind classes** where possible, Webspire tokens for custom properties
4. **Add dark mode** via `.dark` class or `@media (prefers-color-scheme: dark)`
5. **Add `prefers-reduced-motion`** for all animations

## Accessibility

All Webspire snippets include:
- `@media (prefers-reduced-motion: reduce)` handlers
- Proper `aria-hidden="true"` on decorative elements
- Focus-visible support for interactive patterns

## Glass Effects

Available via MCP: `glass/frosted`, `glass/subtle`, `glass/bold`, `glass/colored`, `glass/dark`.

```html
<div class="glass-colored rounded-xl p-6" style="--glass-hue: 220">
  Blue tinted glass
</div>
```

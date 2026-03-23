---
name: darkmode
description: Dark mode implementation patterns for Astro with Tailwind v4. Use this skill when adding dark mode support, theming, or fixing contrast issues.
---

# Dark Mode Patterns

## Activation Methods

### 1. Class-based (recommended for toggle support)

Tailwind v4 custom variant in CSS entry:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

Init script in `<head>` (must be `is:inline` to prevent FOUC):
```html
<script is:inline>
  function getStoredTheme() {
    try {
      return document.cookie.match(/(?:^|;\s*)theme=(dark|light)(?:;|$)/)?.[1] || localStorage.getItem('theme');
    } catch (e) {
      return null;
    }
  }

  function applyTheme() {
    var t = getStoredTheme();
    document.documentElement.classList.remove('no-js');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  applyTheme();
  if (window.__applyThemeHandler) {
    document.removeEventListener('astro:after-swap', window.__applyThemeHandler);
  }
  window.__applyThemeHandler = applyTheme;
  document.addEventListener('astro:after-swap', window.__applyThemeHandler);
</script>
```

### 2. OS-only (no toggle, simpler)

Tailwind v4 uses `prefers-color-scheme` by default — no configuration needed. Just use `dark:` classes.

## Persistence

### Cookie
```javascript
document.cookie = 'theme=' + value + ';path=/;max-age=31536000;SameSite=Lax';
```
Technical cookie — no consent banner required (UI preference, not tracking). Add a `domain=` attribute only if you explicitly need cross-subdomain persistence.

### localStorage (single domain fallback)
```javascript
localStorage.setItem('theme', value);
```

## Toggle Implementation

```javascript
btn.addEventListener('click', function() {
  var isDark = document.documentElement.classList.toggle('dark');
  var v = isDark ? 'dark' : 'light';
  document.cookie = 'theme=' + v + ';path=/;max-age=31536000;SameSite=Lax';
  try { localStorage.setItem('theme', v); } catch(e) {}
});
```

Use the Cookie Store API only if your browser support targets allow it. Plain `document.cookie` remains the compatibility fallback used in this template.

## CSS Patterns

### Scoped styles in Astro components
```css
<style>
  .my-component { background: #f8f9fa; color: #1f2937; }
  :global(html.dark) .my-component { background: #2a3234; color: #d2cdc8; }
</style>
```

### Tailwind utilities
```html
<div class="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">
```

## Color Guidelines

| Principle | Light | Dark |
|-----------|-------|------|
| **Background** | Warm off-white | Warm dark (not pure black) |
| **Text** | Near-black | Off-white (not pure white) |
| **Borders** | Light gray | Muted dark |
| **Accents** | Adjust brightness | Lighten or warm up |

### Contrast Minimums (WCAG AA)
- Body text: 4.5:1 ratio
- Large text (18px+): 3:1 ratio
- Interactive elements: 3:1 ratio

## Logo Handling

Provide two logo variants and toggle via CSS:
```html
<img src="/logo.svg" class="block dark:hidden" alt="Logo" />
<img src="/logo-dark.svg" class="hidden dark:block" alt="Logo" />
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Pure `#000000` background | Use warm dark like `#1e2628` or `#222a2c` |
| Pure `#ffffff` text on dark | Use off-white like `#e6e1dc` or `#d2cdc8` |
| Cold grays in dark mode | Use warm-tinted grays (teal/sand undertone) |
| Same accent color light/dark | Lighten or warm up accents for dark surfaces |
| `@media (prefers-color-scheme)` in scoped styles | Use `:global(html.dark)` for class-based |
| Missing dark mode on borders | Add `dark:border-*` — borders are very visible in dark |

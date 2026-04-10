---
name: ui-design
description: Core UI design rules for building professional interfaces. Apply these when creating or reviewing pages, components, and layouts.
---

# UI Design Rules

Apply these 7 rules whenever building or reviewing UI. Most bad UIs fail not on technical grounds, but on consistency, hierarchy, and missing systems.

## 1. No pure black/white

- ❌ `#000` on `#fff` — harsh, tiring
- ✅ slightly softened: `#111` / `#f5f5f5`, or OKLCH equivalents
- In this project: use `--color-text` (`oklch(18% 0 0)`) and `--color-bg` (`oklch(98% 0 0)`)

## 2. Consistent spacing — 8px system

- ❌ arbitrary values: 13px, 22px, 7px
- ✅ fixed scale: 8, 16, 24, 32, 48, 64 …
- In Tailwind: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- Use `--space-sm`, `--space-md`, `--space-lg` tokens where defined

## 3. Max 2 typefaces

- ❌ many fonts = visual noise
- ✅ 1–2 fonts + varied weights
- This project: Inter (UI) + Lora (blog editorial) + Fira Code (code)
- Vary weight and size before reaching for a new font family

## 4. Color system — 60 / 30 / 10

| Share | Role | Examples |
|---|---|---|
| 60% | Background | `--color-bg`, `--color-bg-secondary` |
| 30% | Surfaces | `--color-surface`, cards, panels |
| 10% | Accent | `--color-accent`, buttons, highlights |

Accent is reserved for actions and focal points — overusing it removes its meaning.

## 5. Clear type hierarchy

- ❌ headings too similar in size
- ✅ minimum 1.25×–1.5× step between levels
- `h1` dominant, `h2` clearly smaller, `h3` body-adjacent
- Use the defined text-scale tokens; don't freestyle sizes

## 6. Readable line length

- ❌ full-width text → eye fatigue
- ✅ ~50–75 characters per line → `max-w-prose` (65ch) in Tailwind
- Apply `max-w-prose` or `max-w-2xl` to article/blog body text
- Navigation and UI elements are exempt

## 7. Visual hierarchy — the most important rule

Every interactive element needs a tier:

| Tier | Usage | Style |
|---|---|---|
| Primary | One dominant CTA per view | Filled, accent color, high contrast |
| Secondary | Supporting actions | Outlined or muted |
| Ghost / Tertiary | Low-priority actions | Text-only or subtle border |

Never have two primary buttons competing on the same screen. If everything shouts, nothing does.

---

## Quick checklist for new pages

- [ ] No pure `#000` / `#fff` — using design tokens?
- [ ] Spacing follows 8px grid?
- [ ] Max 2 font families in use?
- [ ] Accent color appears in ≤10% of the surface area?
- [ ] Heading sizes have clear visual steps?
- [ ] Body text constrained to ~65ch?
- [ ] Only one primary CTA visible per section?

# Experiment: Astro 7 (alpha) + Vite 8

- **Date:** 2026-05-23
- **Branch:** `experiment/astro-7-vite-8`
- **Goal:** Find out whether the template can run on Astro 7 (which ships Vite 8), since `@sveltejs/vite-plugin-svelte@7` requires Vite 8 and stable Astro 6 is capped at Vite 7.
- **Result:** ❌ Not viable yet. The alpha stack installs and runs on Vite 8, but the build emits broken HTML (`[object Object]`) for nearly every page.

## Stack under test

| Package | Stable (master) | Alpha (this experiment) |
|---|---|---|
| astro | `^6.3.7` (Vite 7) | `7.0.0-alpha.1` (Vite `^8.0.8`) |
| @astrojs/cloudflare | `^13.5.4` | `14.0.0-alpha.0` |
| @astrojs/mdx | `^5.0.6` | `6.0.0-alpha.0` |
| @astrojs/svelte | `^8.1.1` | `9.0.0-alpha.0` |
| @astrojs/rss | `^4.0.18` | unchanged (no astro peer) |
| @astrojs/check | `^0.9.9` | unchanged |
| @tailwindcss/vite | `^4.3.0` | unchanged — peer already allows `vite ^8` |
| @sveltejs/vite-plugin-svelte | `^6.2.4` | resolved transitively by `@astrojs/svelte@9-alpha` (still 6.2.4) |

Only the catalog in `pnpm-workspace.yaml` was changed. No application code was touched.

## Method

```bash
git checkout -b experiment/astro-7-vite-8
# bump catalog entries above, then:
pnpm install
pnpm --filter @astro-v6/starter build
pnpm --filter @astro-v6/blog build
```

## Results

### Install — works (peer warnings only)
pnpm is non-strict (no `.npmrc`), so peer mismatches are warnings, not failures. `pnpm peers check` reported:

- `astro 7.0.0-alpha.1` not allowed by `@casoon/astro-post-audit` (`^5.0.0 || ^6.0.0-beta.0`) and `@casoon/astro-speed-measure` (`^5.0.0 || ^6.0.0`)
- `typescript 6.0.3` vs `@astrojs/svelte@9-alpha` peer `^5.3.3`
- `vite 8.0.14` vs `@sveltejs/vite-plugin-svelte@6.2.4` peer `^6.3.0 || ^7.0.0`

### Vite 8 — confirmed active
`vite: 8.0.14`, and Vite 8 now bundles **Rolldown** (`rolldown: 1.0.2`) as its bundler.

### Build — broken output
Astro's pipeline runs to completion (no render crash), but the prerendered HTML is wrong. Nearly every page is exactly 15 bytes:

```
$ cat apps/starter/dist/client/index.html
[object Object]
```

| File | Size |
|---|---|
| `apps/starter/dist/client/index.html` | 15 B (`[object Object]`) |
| `apps/starter/dist/client/contact/index.html` | 15 B |
| `apps/starter/dist/client/de/index.html` | 15 B |
| `apps/blog/dist/client/index.html` | 15 B |
| `apps/blog/dist/client/blog/index.html` | 275 B (only non-empty page) |
| `apps/blog/dist/client/blog/welcome/index.html` | 15 B |

`@casoon/astro-post-audit` correctly flagged these as empty (missing `<title>`, `lang`, `<h1>`, canonical, viewport) and failed the build in the `astro:build:done` hook. **This is not a post-audit bug** — the pages really are empty.

## Root cause

The render result is being stringified to `[object Object]` instead of having its HTML body written out. This happens during static prerender, so the prime suspect is **`@astrojs/cloudflare@14.0.0-alpha.0`** not yet handling Astro 7's render output (Response/render object) under the Vite 8 / Rolldown pipeline.

## Secondary findings (Vite 8 / Rolldown migration debt)

Warnings emitted by Astro core / the adapter that are not yet Vite-8-ready:

- `vite-plugin-svelte`: *"Support for vite 8 beta in vite-plugin-svelte is experimental (rolldown: 1.0.2, vite: 8.0.14)"*
- `resolve.alias` with `customResolver` — deprecated, removed in Vite 9
- `optimizeDeps.esbuildOptions` — deprecated; Vite 8 uses Rolldown, expects `optimizeDeps.rolldownOptions`

## Conclusion

Vite 8 itself loads and runs, but the Astro 7 alpha adapter/render stack is not ready. Expected for an `alpha.1`. Re-test when:

1. Astro 7 reaches at least **beta**, and
2. `@astrojs/cloudflare` ships a matching build, and
3. `@casoon/astro-post-audit` / `@casoon/astro-speed-measure` widen their peer ranges to include Astro 7 (tracked upstream).

## Revert

```bash
git checkout master   # stable Astro 6 catalog
git branch -D experiment/astro-7-vite-8   # if discarding
```

# Vite 8 Compatibility Test

**Branch:** `feat/vite-8`
**Date:** 2026-03-18
**Vite version:** 8.0.0 (via `pnpm.overrides`)
**Rolldown:** 1.0.0-rc.9

## Result

Both apps (Starter + Blog) build successfully. No build errors, no runtime errors.

## Deprecation Warnings

### 1. `resolve.alias` with `customResolver` (Astro / Cloudflare Adapter)

```
[vite] `resolve.alias` contains an alias with `customResolver` option.
This is deprecated and will be removed in Vite 9.
Please use a custom plugin with a resolveId hook and `enforce: 'pre'` instead.
```

- **Source:** Astro Core / `@astrojs/cloudflare`
- **Action required:** None on our side — needs upstream fix in Astro
- **Risk:** Only breaking in Vite 9

### 2. `optimizeDeps.esbuildOptions` deprecated

```
[vite] You or a plugin you are using have set `optimizeDeps.esbuildOptions`
but this option is now deprecated. Vite now uses Rolldown to optimize the dependencies.
Please use `optimizeDeps.rolldownOptions` instead.
```

- **Source:** Astro Core (Vite 8 uses Rolldown instead of esbuild for dependency pre-bundling)
- **Action required:** None on our side — needs upstream fix in Astro
- **Risk:** Still works, option is silently ignored

### 3. `transformWithEsbuild` deprecated

```
`transformWithEsbuild` is deprecated and will be removed in the future.
Please migrate to `transformWithOxc`.
```

- **Source:** Astro / MDX Plugin
- **Action required:** None on our side — needs upstream migration

## vite-plugin-svelte

- `@sveltejs/vite-plugin-svelte` v6.x showed an experimental warning with Vite 8
- **Resolved** by overriding to `@sveltejs/vite-plugin-svelte@^7.0.0` which has native Vite 8 support
- No issues encountered during build

## Build Performance

| App     | Vite 7 (before) | Vite 8 | Difference |
|---------|-----------------|--------|------------|
| Starter | 2.14s           | 1.93s  | -204ms     |
| Blog    | 2.31s           | 1.85s  | -454ms     |

Rolldown as the new dependency optimizer provides slight performance improvements.

## Conclusion

- Vite 8 is **build-compatible** with the current stack
- All warnings originate from **upstream dependencies** (Astro, Cloudflare Adapter) — no action required in our own code
- `vite-plugin-svelte` v7.0.0 provides full Vite 8 support (override added)
- Wait for official Astro Vite 8 support before using in production

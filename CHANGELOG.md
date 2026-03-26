# Changelog

## [1.3.0] - 2026-03-26

### Updated
- Astro `6.0.8` → `6.1.0`

### Astro 6.1.0 — Highlights

**Features**
- **Sharp Image Config** — `image.service.config` in `astro.config.mjs` für Encoder-Optionen (mozjpeg, webp effort, avif, avif chroma, png compression). Per-Image `quality` hat weiterhin Vorrang.
- **i18n `fallbackRoutes`** — Integrations können Fallback-Routen über den `astro:routes:resolved`-Hook auslesen (bei `fallbackType: 'rewrite'`).
- **SmartyPants-Objekt** — `markdown.smartypants` akzeptiert jetzt ein Options-Objekt (`backticks`, `dashes`, `ellipses`, `quotes` etc.) statt nur `true/false`.

**Relevante Bugfixes**
- **CSRF `checkOrigin`** — liest `X-Forwarded-Proto` hinter TLS-terminierenden Reverse Proxies; Prod- und Dev-Verhalten sind jetzt konsistent.
- **Cloudflare `server:defer`** — Dev-Crash `serverIslandNameMap.get is not a function` beim Navigieren zwischen Seiten behoben.
- **Middleware HMR** — Änderungen an der Middleware werden im Dev-Server jetzt korrekt erkannt.
- **Vite 8-Warnung** — Astro warnt aktiv, wenn Vite 8 in den Abhängigkeiten hochgeholt wird (Konflikt mit Astro's Vite 7-Anforderung).
- **Font-Build** — Schriftdateien wurden unnötig mehrfach in den Build kopiert.
- **svgo** — Security-Update auf aktuelle Version.
- **ClientRouter** — Animationen werden übersprungen, wenn der Browser bereits eine native visuelle Transition bereitstellt.

---

## [1.2.0] - 2026-03-23

### Added
- Cloudflare `_headers` für beide Apps: immutable Cache für Hashed Assets, Fonts und OG-Images; `no-cache + s-maxage=3600` für HTML; Security Headers auf allen Routen.
- Performance-Checks im `final-pass`-Skill (Images, CSS, JS, Resource Hints).
- `nosecrets`-Badge in der README.

### Changed
- GitHub Actions auf aktuelle Versionen (`actions/checkout@v6`, `actions/cache@v5`, `pnpm/action-setup@v5`).
- `type-check`-Script auf `pnpm -r run type-check` (sequentiell, da paralleles `astro check` Port 9229 kollidiert).
- Build-Script auf `pnpm -r --parallel run build` für parallele App-Builds.

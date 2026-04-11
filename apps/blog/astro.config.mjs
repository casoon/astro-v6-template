import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import crawlerPolicy from '@casoon/astro-crawler-policy';
import postAudit from '@casoon/astro-post-audit';
import astroSitemap from '@casoon/astro-sitemap';
import speedMeasure from '@casoon/astro-speed-measure';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { env } from './src/env.ts';
import { getBlogRssItems, getBlogSitemapEntries } from './src/utils/blog-rss.js';

export default defineConfig({
  site: env.PUBLIC_SITE_URL,
  adapter: cloudflare(),

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    svelte({
      compilerOptions: { runes: true },
    }),
    mdx(),
    astroSitemap({
      // i18n: generate hreflang alternate links for every page
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', de: 'de-DE' },
      },

      // exclude: blog index is a listing page, not a canonical content destination
      exclude: [/\/blog\/?$/, /\/de\/blog\/?$/],

      // priority: pattern-based rules applied to discovered URLs
      priority: [
        { pattern: '/$', priority: 1.0 }, // homepage
        { pattern: '/blog$', priority: 0.8 }, // blog index
        { pattern: '/blog/', priority: 0.7 }, // individual posts
      ],

      // changefreq: expected update frequency per URL pattern
      changefreq: [
        { pattern: '/$', changefreq: 'weekly' },
        { pattern: '/blog/', changefreq: 'monthly' },
      ],

      // sources: add dynamic entries with real lastmod dates from MDX frontmatter.
      // getCollection() is unavailable in build hooks — gray-matter reads the files directly.
      sources: [getBlogSitemapEntries],

      // audit: warn on empty sitemap; duplicates are expected because sources()
      // re-adds blog posts to inject real lastmod dates (last entry wins)
      audit: {
        warnOnEmpty: true,
        errorOnDuplicates: false,
        warnOnDuplicates: false,
      },

      // rss: generate /rss.xml alongside the sitemap
      rss: {
        title: env.PUBLIC_SITE_NAME,
        description: 'A blog template built with Astro v6, MDX and Content Collections.',
        language: env.PUBLIC_LOCALE,
        getItems: getBlogRssItems,
      },
    }),
    crawlerPolicy({
      // citationFriendly: allow search engines + AI citation, block AI training
      preset: 'citationFriendly',
      sitemaps: [`${env.PUBLIC_SITE_URL}/sitemap.xml`],

      // contentSignals: machine-readable hints for AI crawlers
      contentSignals: {
        search: true,
        aiInput: true,
        aiTrain: false,
      },

      // llmsTxt: generate /llms.txt with a human-readable AI content policy
      output: {
        robotsTxt: true,
        llmsTxt: true,
      },

      // env: lock crawlers out on non-production deployments
      env: {
        staging: { preset: 'lockdown' },
        preview: { preset: 'lockdown' },
      },
    }),
    speedMeasure(),
    postAudit({
      throwOnError: false,
      rules: {
        filters: { exclude: ['blog/index.html', '404.html'] },
        canonical: { self_reference: true },
        headings: { no_skip: true },
        html_basics: { meta_description_required: true },
        opengraph: {
          require_og_title: true,
          require_og_description: true,
          require_og_image: true,
        },
        a11y: {
          require_skip_link: true,
          require_img_alt: true,
          require_button_text: true,
          require_label: true,
        },
        links: { check_fragments: true },
        sitemap: {
          require: true,
          canonical_must_be_in_sitemap: true,
          entries_must_exist_in_dist: true,
        },
        security: {
          check_target_blank: true,
        },
        hreflang: {
          check_hreflang: true,
          require_x_default: true,
          require_self_reference: true,
          require_reciprocal: true,
        },
      },
    }),
  ],

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  security: {
    checkOrigin: true,
  },

  csp: {
    algorithm: 'SHA-256',
  },

  // Cloudflare Workers does not support Sharp — use noop image service.
  // When deploying to Node.js/Vercel/Netlify, replace with the Sharp service
  // and configure codec-specific options (new in Astro 6.1):
  //
  // image: {
  //   service: {
  //     entrypoint: 'astro/assets/services/sharp',
  //     config: {
  //       webp: { effort: 6, alphaQuality: 90 },
  //       avif: { effort: 4, chromaSubsampling: '4:2:0' },
  //       jpeg: { mozjpeg: true },
  //       png:  { compressionLevel: 8 },
  //     },
  //   },
  // },
  image: {
    service: { entrypoint: 'astro/assets/services/noop' },
  },

  // SmartyPants typography (options object new in Astro 6.1).
  // Converts ASCII punctuation to proper typographic characters in Markdown/MDX.
  markdown: {
    smartypants: {
      dashes: 'oldschool', // -- → en-dash, --- → em-dash
      ellipses: true, // ... → …
      backticks: false, // keep backticks as-is (used in code)
      quotes: true, // "hello" → "hello"
    },
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['sharp'],
      noExternal: ['@fontsource/*'],
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },
});

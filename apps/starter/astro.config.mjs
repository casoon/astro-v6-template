import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',

  integrations: [
    svelte({
      compilerOptions: { runes: true },
    }),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@fontsource/*'],
    },
  },

  build: {
    inlineStylesheets: 'auto',
  },
});

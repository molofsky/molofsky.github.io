// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

// set GH_PAGES=1 in your Pages workflow build step
const base = process.env.GH_PAGES ? '/portfolio/' : '/';

export default defineConfig({
  site: 'https://molofsky.github.io/portfolio/',
  base,
  vite: { plugins: [tailwind()] },
});
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://molofsky.github.io',
  base: '/',
  vite: { plugins: [tailwind()] },
});
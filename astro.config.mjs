import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  site: process.env.ASTRO_SITE || 'https://sinannar.github.io',
  base: process.env.ASTRO_BASE || '/',
  trailingSlash: 'always',
  output: 'static',
  vite: {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src/keynote', import.meta.url)) },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages hosts this project at /hmi-documentation/.
  base: process.env.GITHUB_PAGES === 'true' ? '/hmi-documentation/' : '/',
});

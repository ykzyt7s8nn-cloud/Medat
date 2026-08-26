import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative Pfade: Damit läuft der Build auf jedem Host, auch in einem
  // Unterverzeichnis (z. B. GitHub Pages unter /Repo-Name/).
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
  },
});

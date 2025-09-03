import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // Add base path for GitHub Pages deployment
  base: 'https://duo-keyboard-koalition.github.io/',
});

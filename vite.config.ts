import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${process.env.VITE_SUPABASE_URL}/functions/v1`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add the anon key header for Supabase
            proxyReq.setHeader('apikey', process.env.VITE_SUPABASE_ANON_KEY);
            console.log('Proxying request to:', proxyReq.path);
          });
        },
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  // Set base path for GitHub Pages deployment with custom domain
  base: '/',
});
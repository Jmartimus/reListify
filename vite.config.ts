import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
  },
  server: {
    origin: 'http:127.0.0.1:8080',
    proxy: {
      '/api': process.env.VITE_API_URL || 'http://localhost:8080',
    },
  },
});

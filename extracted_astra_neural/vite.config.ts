import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'), 
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
            'vendor-react': ['react', 'react-dom', 'framer-motion'],
            'vendor-ai': ['@google/genai'],
            'vendor-utils': ['jspdf', 'html2canvas', 'zod'],
        },
      },
    },
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './src/index.html',
      },
      output: {
        manualChunks: {
          'tambo-react': ['react', 'react-dom'],
          'tambo-sdk': ['@tambo-ai/react', 'zod'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api/tambo': {
        target: 'https://api.tambo.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tambo/, ''),
      },
    },
  },
});

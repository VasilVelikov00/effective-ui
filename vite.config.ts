import { defineConfig } from 'vite';

export default defineConfig({
  root: 'dev',
  build: {
    outDir: '../dist-dev',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});

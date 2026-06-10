import { defineConfig } from 'vite';

export default defineConfig({
  base: '/100-days-games/',
  build: {
    outDir: 'release',
    emptyOutDir: false,
    rollupOptions: {
      input: 'index.html'
    }
  }
});

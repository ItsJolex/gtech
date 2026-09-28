import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        accessories: fileURLToPath(new URL('./accessories.html', import.meta.url)),
        alliances: fileURLToPath(new URL('./alliances.html', import.meta.url)),
        admin: fileURLToPath(new URL('./admin.html', import.meta.url))
      }
    }
  }
});

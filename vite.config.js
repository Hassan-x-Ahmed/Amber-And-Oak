import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
      rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        menu: resolve(__dirname, 'menu.html'),
        admin: resolve(__dirname, 'admin.html')
        // NOTE: If you have any other HTML files (like reservation.html), 
        // just add them right here in the exact same format!
      }
    }
  }
});


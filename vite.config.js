import { defineConfig } from 'vite'
import { createVuePlugin as vue } from "vite-plugin-vue2";
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
      '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/support/setup',
  },
  build: {
    outDir: 'dist/public',
  },
});
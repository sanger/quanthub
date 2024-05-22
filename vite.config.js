import vue from '@vitejs/plugin-vue'
import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      include: ['src/**'],
      reporter: ['text', 'json'],
    },
  },
  build: {
    outDir: 'dist/public',
  },
})

import { defineConfig } from 'vite'
import { createVuePlugin as vue } from "vite-plugin-vue2";
import autoprefixer from 'autoprefixer';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { fileURLToPath, URL } from 'url'
import path from 'path'
// const path = require("path");

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      globals: {
        Buffer: true,
      },
  }),
  ],
  optimizeDeps: {
		include: ['lodash-es',],
	},
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
});
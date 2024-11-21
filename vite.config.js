import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const fs = require("fs");

const version = fs.readFileSync('./version', {encoding:'utf8', flag:'r'}).trim()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: '/@src/',
        replacement: `/src/`,
      },
    ],
  },
  define: {
    __APP_VERSION__: `"${version}"`,
  },
  server: {
    host: true,
    port: 8000,
  }
})


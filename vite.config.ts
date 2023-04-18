import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'owned2fa',
        short_name: 'owned2fa',
        theme_color: '#0ea5e9',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,svg,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

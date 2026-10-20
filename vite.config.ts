import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Für GitHub Pages (https://<name>.github.io/<repo>/) setzt der Workflow BASE_PATH=/<repo>/
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Tagesrapport · Schlosserei Menge',
        short_name: 'Rapport',
        description: 'Rapportkarte scannen, Arbeiten erfassen, Rapport als PDF senden.',
        lang: 'de',
        start_url: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // OCR-Dateien (~5 MB) nicht vorab laden, sondern beim ersten Scan zwischenspeichern
        globIgnores: ['ocr/**'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            // Tesseract: Worker, WASM-Kern und Sprachdaten (public/ocr) für offline zwischenspeichern
            urlPattern: ({ url }) => url.pathname.includes('/ocr/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'ocr-cdn',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
} as import('vite').UserConfig);

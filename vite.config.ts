import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Datenschutz: Der Browser darf nur mit dem eigenen Server sprechen. Keine CDNs, keine Analyse,
// keine externen Schriften – Kundendaten, Fotos und Unterschriften verlassen das Gerät nur über
// „Teilen“/Download durch den Mitarbeiter. Nur im Build (der Dev-Server braucht Inline-Skripte).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval' blob:", // Texterkennung: WebAssembly + Worker aus Blob
  "worker-src 'self' blob:",
  "connect-src 'self' blob: data:",
  "img-src 'self' data: blob:",
  "media-src 'self' blob: mediastream:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const csp = (): Plugin => ({
  name: 'csp',
  apply: 'build',
  transformIndexHtml: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' }],
});

export default defineConfig({
  // Für GitHub Pages (https://<name>.github.io/<repo>/) setzt der Workflow BASE_PATH=/<repo>/
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    csp(),
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
        // Alles vorab speichern – auch Texterkennung (Worker, WASM-Kern, deutsche Sprachdaten, ~9 MB),
        // damit die App nach dem ersten Öffnen ohne Internet vollständig funktioniert.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,gz,webmanifest}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'node',
  },
} as import('vite').UserConfig);

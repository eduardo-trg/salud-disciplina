import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Salud & Disciplina',
        short_name: 'SaludDisciplina',
        description: 'Tu compañero para hábitos Low-Carb sostenibles',
        theme_color: '#ffffff',
        background_color: '#f9fafb',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [{
          urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
          handler: 'NetworkFirst',
          options: { cacheName: 'firebase-cache', expiration: { maxEntries: 50, maxAgeSeconds: 3600 } }
        }]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});

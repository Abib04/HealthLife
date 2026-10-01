import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/healthlife/',
  plugins: [
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'HealthLife — Endurance Self-Coaching',
        short_name: 'HealthLife',
        description: 'Self-coaching untuk latihan endurance yang konsisten dan terarah.',
        theme_color: '#f5f6f4',
        background_color: '#f5f6f4',
        display: 'standalone',
        start_url: '/healthlife/',
        scope: '/healthlife/',
        lang: 'id',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,png,ico}'] },
    }),
  ],
});

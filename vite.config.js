import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const manifest = {
   theme_color: '#262627',
   background_color: '#ffffff',
   icons: [
      { purpose: 'maskable', sizes: '512x512', src: 'icon512_maskable.png', type: 'image/png' },
      { purpose: 'any', sizes: '512x512', src: 'icon512_rounded.png', type: 'image/png' },
   ],
   screenshots: [{ src: 'desktop.png', sizes: '1904x899', type: 'image/png', form_factor: 'wide' }],
   screenshots: [{ src: 'mobile.png', sizes: '378x808', type: 'image/png', form_factor: 'narrow' }],
   orientation: 'any',
   display: 'standalone',
   dir: 'auto',
   lang: 'ru-RU',
   name: 'Наше приложение',
   short_name: 'my app',
   start_url: '/',
};

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [
      react(),
      nodePolyfills({
         protocolImports: true,
      }),
      VitePWA({
         registerType: 'autoUpdate',
         workbox: {
            globPatterns: ['**/*.{html,css,js,ico,png,svg,jpg}'],
            maximumFileSizeToCacheInBytes: 3000000,
         },
         manifest,
      }),
   ],
   server: {
      host: '0.0.0.0',
      port: 6001,
      open: true,
   },
});

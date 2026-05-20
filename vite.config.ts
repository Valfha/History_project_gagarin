import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// https://vitejs.dev/config/
// base = '/<repo>/' для GitHub Pages, иначе ассеты не находятся.
export default defineConfig({
  base: '/History_project_gagarin/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Прогрев ключевых модулей при старте dev-сервера, чтобы первый
    // запрос браузера не ждал пред-bundle десятков файлов.
    // См. https://vitejs.dev/config/server-options.html#server-warmup
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/Home.tsx',
        './src/pages/Biography.tsx',
        './src/pages/Flight.tsx',
        './src/pages/Technical.tsx',
        './src/components/Layout/Layout.tsx',
        './src/components/Layout/Header.tsx',
        './src/components/Layout/Footer.tsx',
        './src/components/Flight/usePlaybackClock.ts',
        './src/components/Flight/useAudioClips.ts',
        './src/data/biography.ts',
        './src/data/timeline.ts',
        './src/data/sources.ts',
      ],
    },
    watch: {
      // Не следим за служебными директориями: уменьшает FS-нагрузку
      // и сокращает количество ложных HMR-инвалидаций на Windows.
      ignored: [
        '**/.devin/**',
        '**/.git/**',
        '**/screenshots/**',
        '**/docs/**',
        '**/*.txt',
        '**/SESSION_HANDOFF*',
      ],
    },
  },
  optimizeDeps: {
    // Явный список реально используемых на текущих этапах (0-2) deps.
    // Vite пред-bundle их в node_modules/.vite/deps один раз и
    // переиспользует кэш между запусками.
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
    ],
    // Тяжёлые пакеты Этапа 3 (ещё не импортируются нигде в src/).
    // Исключаем из прогрева, чтобы Vite не сканировал тысячи файлов
    // three.js / leaflet / tone при каждом старте dev-сервера.
    // Когда мы начнём их импортировать в Этапе 3, нужно будет
    // переместить эти id в `include`.
    exclude: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'leaflet',
      'react-leaflet',
      'tone',
    ],
  },
});

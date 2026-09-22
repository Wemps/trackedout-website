import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg'],
  build: {
    // mapbox-gl v3 is ~1.9MB raw / ~530KB gzipped, in its own lazily-loaded
    // chunk that is only fetched when the Maps band scrolls into view. That is
    // the point of the dynamic import, not a regression — so don't warn on it.
    // The main bundle is the number to watch; it should stay near 92KB gzipped.
    chunkSizeWarningLimit: 2000,
  },
})

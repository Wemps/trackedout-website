import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  /*
   * Relative, so one build works from both places this is served: the repo
   * subpath on GitHub Pages (/trackedout-website/) and the root of
   * trackedout.app once DNS moves. An absolute base would have to be flipped by
   * hand at cutover, and silently 404 every asset if anyone forgot. Vite treats
   * a relative base as "/" in dev, so `npm run dev` is unaffected.
   *
   * Assets only — the router's basename is derived separately (src/app/routes.ts).
   */
  base: './',
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

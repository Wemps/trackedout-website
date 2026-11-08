import { defineConfig, type Plugin } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/*
 * Routes other than "/" that get their own HTML file in dist/.
 *
 * GitHub Pages has no rewrites: a path with no file behind it is served by
 * public/404.html, which bounces the browser back to "/" with the path in the
 * query string. That works in a browser but answers with a 404 status first,
 * and link checkers (and anything that doesn't run JS) see only that. The App
 * Store's Support URL shouldn't depend on it, so each route listed here gets a
 * copy of index.html at <route>/index.html, served with a 200.
 *
 * The copy sits one directory down, so its relative asset paths ("./assets/…",
 * see `base` below) move up a level. The title, description and og:url are
 * rewritten too, for anything that reads the HTML without running the app.
 */
const STATIC_ROUTES: Record<string, { title: string; description: string }> = {
  support: {
    title: 'Support — Tracked Out',
    description:
      'Get help with Tracked Out. Send us a message.',
  },
}

function staticRoutes(): Plugin {
  let outDir = 'dist'
  return {
    name: 'static-routes',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      for (const [route, meta] of Object.entries(STATIC_ROUTES)) {
        const page = html
          .replace(/(src|href)="\.\//g, '$1="../')
          .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
          .replace(/(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*/g, `$1${meta.title}`)
          .replace(/(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*/g, `$1${meta.description}`)
          .replace(/(<meta property="og:url" content="https:\/\/trackedout\.app\/)[^"]*/, `$1${route}`)
        fs.mkdirSync(path.join(outDir, route), { recursive: true })
        fs.writeFileSync(path.join(outDir, route, 'index.html'), page)
      }
    },
  }
}

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
  plugins: [react(), tailwindcss(), staticRoutes()],
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

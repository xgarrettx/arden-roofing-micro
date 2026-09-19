import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const articles = JSON.parse(readFileSync(resolve(__dirname, './src/data/articles.json'), 'utf-8'))

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  // Build-time route enumeration (includedRoutes below) fetches from the
  // backend to know which /service-areas/* and /services/* pages exist. This
  // runs ON THE BUILD MACHINE, which is normally the same server the backend
  // runs on — so it should hit it over localhost, not round-trip through the
  // public domain (and whatever CDN/proxy sits in front of it). VITE_API_URL
  // is what ships to the *browser* bundle and must stay the public URL;
  // VITE_BUILD_API_URL is a separate, build-only override for this fetch only.
  const apiUrl = process.env.VITE_BUILD_API_URL || process.env.VITE_API_URL || 'http://127.0.0.1:3001'

  return defineConfig({
    plugins: [vue()],
    server: {
      host: '127.0.0.1',
      port: Number(process.env.VITE_APP_DEV_PORT) || 3000,
    },
    resolve: {
      alias: { '@': resolve(__dirname, './src') },
    },
    ssr: {
      // primevue@3's published ESM files use directory imports (e.g.
      // `primevue/api`) that Node's native ESM resolver rejects when
      // vite-ssg executes the built SSR bundle directly. Bundling it into
      // the SSR chunk instead of leaving it as an external `import` sidesteps
      // that — the alternative would be dropping the guidelines' pinned
      // `primevue@3` for a v4 rewrite, which wasn't asked for here.
      noExternal: ['primevue'],
    },
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
    ssgOptions: {
      formatting: 'minify',
      // vite-ssg 28+ ships critical-CSS inlining via `beasties`; this is a
      // small marketing site with one global stylesheet, so the inlining
      // pass isn't worth the extra build complexity — disable it.
      beastiesOptions: false,
      // Every route vite-ssg does not already know from the static route
      // table needs to be listed here so `vite-ssg build` renders one static
      // HTML file per town/service page (this is what gives the location
      // pages real crawlable content instead of a client-only SPA shell).
      includedRoutes: async (paths) => {
        // vite-ssg seeds `paths` from the router's own route table, which
        // includes the *literal* dynamic-segment patterns themselves (e.g.
        // "/service-areas/:citySlug", "/services/:serviceSlug",
        // "/legal/:legalSlug") and the catch-all ("/:pathMatch(.*)*") — none
        // of those are real pages, so left in place they each get rendered
        // and written as their own dead `:paramName.html` file (and, for the
        // location/service ones, trigger a real API request for the literal
        // placeholder string, which 404s during the build). Drop anything
        // with a `:` and replace it with the real enumerated paths below.
        const staticPaths = paths.filter((p) => !p.includes(':'))
        const legalPaths = articles.filter((a) => a.route.startsWith('/legal/')).map((a) => a.route)

        try {
          const [locationsRes, servicesRes] = await Promise.all([
            fetch(`${apiUrl}/locations`).then((r) => r.json()),
            fetch(`${apiUrl}/services`).then((r) => r.json()),
          ])
          const locationPaths = locationsRes.map((l) => `/service-areas/${l.slug}`)
          const servicePaths = servicesRes.map((s) => `/services/${s.slug}`)
          return [...new Set([...staticPaths, ...legalPaths, ...locationPaths, ...servicePaths])]
        } catch (err) {
          console.warn(
            '[vite-ssg] Could not reach the API to enumerate location/service routes. ' +
              'Start the backend (npm run start:dev in ../backend) before building, ' +
              'otherwise only the static routes will be prerendered.\n',
            err.message,
          )
          return [...new Set([...staticPaths, ...legalPaths])]
        }
      },
    },
  })
}

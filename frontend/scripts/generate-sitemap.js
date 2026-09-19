// Run after `npm run build` (see package.json's "postbuild" script) to write
// dist/sitemap.xml from the live CMS content, so every location/service page
// is listed without hand-maintaining the list. Also writes dist/robots.txt.
import { writeFileSync } from 'fs'
import { resolve } from 'path'
// This runs as a plain `node` process via the "postbuild" npm script, not
// through Vite — so unlike the vite-ssg build step itself, it does NOT get
// .env values injected automatically (that's Vite's own doing, exposed as
// import.meta.env.* only during the Vite-driven build). Load the same .env
// file directly so this script sees the real VITE_API_URL/VITE_SITE_ORIGIN
// instead of silently falling back to the hardcoded dev defaults below.
import 'dotenv/config'

const apiUrl = process.env.VITE_API_URL || 'http://127.0.0.1:3001'
const siteOrigin = process.env.VITE_SITE_ORIGIN || 'https://ardenroofing.com'
const distDir = resolve(process.cwd(), 'dist')

const STATIC_PATHS = [
  '/',
  '/about',
  '/services',
  '/service-areas',
  '/contact',
  '/estimate',
  '/faq',
  '/team',
  '/careers',
  '/legal/privacy-policy',
  '/legal/terms-conditions',
  '/legal/disclaimer',
  '/legal/accessibility',
  '/legal/complaints-policy',
  '/legal/referral-marketing-disclosure',
]

async function main() {
  const [locations, services] = await Promise.all([
    fetch(`${apiUrl}/locations`).then((r) => r.json()),
    fetch(`${apiUrl}/services`).then((r) => r.json()),
  ])

  const paths = [
    ...STATIC_PATHS,
    ...services.map((s) => `/services/${s.slug}`),
    ...locations.map((l) => `/service-areas/${l.slug}`),
  ]

  const urls = paths
    .map((path) => `  <url><loc>${siteOrigin}${path}</loc></url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  writeFileSync(resolve(distDir, 'sitemap.xml'), xml)

  const robots = `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`
  writeFileSync(resolve(distDir, 'robots.txt'), robots)

  console.log(`Wrote sitemap.xml with ${paths.length} URLs and robots.txt to ${distDir}`)
}

main().catch((err) => {
  console.error('[generate-sitemap] Failed — is the backend running at', apiUrl, '?')
  console.error(err)
  process.exit(1)
})

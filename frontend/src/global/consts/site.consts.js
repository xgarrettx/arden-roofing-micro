// Business identity constants shared across pages, the site header/footer,
// and JSON-LD structured data. Kept out of the CMS on purpose — these
// rarely change and every page needs them synchronously at prerender time.
export const SITE = {
  name: 'Arden Roofing',
  siteOrigin: import.meta.env.VITE_SITE_ORIGIN || 'https://ardenroofing.com',
  phoneDisplay: '(828) 305-4838',
  phoneHref: 'tel:8283054838',
  email: 'sales@ardenroofing.com',
  themeColor: '#5d1adb',
  addressLocality: 'Arden',
  addressRegion: 'NC',
  defaultOgImage: '/assets/images/hero.jpg',
}

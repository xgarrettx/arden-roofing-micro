export const API_BASE_URL = import.meta.env.VITE_API_URL

// Build-machine-only override (see api.service.js) — only meaningful
// during vite-ssg's server-side prerender pass, never in the browser.
export const SSR_API_BASE_URL = import.meta.env.VITE_BUILD_API_URL

export const API_ROUTES = {
  LOCATIONS: {
    BASE: '/locations',
    LIST: '/locations',
    DETAIL: (slug) => `/locations/${slug}`,
  },
  SERVICES: {
    BASE: '/services',
    LIST: '/services',
    DETAIL: (slug) => `/services/${slug}`,
  },
  TEAM: {
    BASE: '/team',
    LIST: '/team',
  },
  LEADS: {
    BASE: '/leads',
    CREATE: '/leads',
  },
}

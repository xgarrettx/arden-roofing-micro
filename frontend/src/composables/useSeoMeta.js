import { computed, unref } from 'vue'
import { useHead } from '@unhead/vue'
import { SITE } from '@/global/consts/site.consts'

/**
 * Sets per-route <title>, meta description, canonical link, robots, and an
 * optional JSON-LD graph. Values may be refs/computed or plain values — this
 * runs during vite-ssg's prerender for every route, which is what lets each
 * of the 35+ location/service pages ship unique, crawlable <head> content
 * instead of a single shared SPA shell.
 *
 * @param {object} options
 * @param {string|import('vue').Ref<string>} options.title
 * @param {string|import('vue').Ref<string>} options.description
 * @param {string|import('vue').Ref<string>} options.path - route path starting with "/"
 * @param {object|import('vue').Ref<object>} [options.jsonLd]
 */
export function useSeoMeta({ title, description, path, jsonLd }) {
  useHead({
    title: () => unref(title),
    meta: [
      { name: 'description', content: () => unref(description) },
      { name: 'robots', content: 'all' },
      { name: 'theme-color', content: SITE.themeColor },
      { property: 'og:title', content: () => unref(title) },
      { property: 'og:description', content: () => unref(description) },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: () => `${SITE.siteOrigin}${unref(path)}` },
    ],
    link: [{ rel: 'canonical', href: () => `${SITE.siteOrigin}${unref(path)}` }],
    script: computed(() => {
      const graph = unref(jsonLd)
      if (!graph) return []
      return [{ type: 'application/ld+json', innerHTML: JSON.stringify(graph) }]
    }),
  })
}

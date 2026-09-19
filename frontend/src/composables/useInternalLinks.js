import { useRouter } from 'vue-router'

/**
 * v-html content (ported article/legal copy, FAQ answers) can contain plain
 * <a href="/about"> links to other pages on this site. Without this, a click
 * on one triggers a full page reload instead of a client-side navigation
 * (the destination still works, since every route is prerendered — it's
 * just not an SPA transition). This intercepts same-origin relative links
 * and routes them through vue-router instead.
 */
export function useInternalLinkClick() {
  const router = useRouter()

  return function onClick(event) {
    const link = event.target.closest('a')
    if (!link) return

    const href = link.getAttribute('href') || ''
    const isInternal = href.startsWith('/') && !href.startsWith('//')
    const opensNewTab = link.target === '_blank'

    if (isInternal && !opensNewTab) {
      event.preventDefault()
      router.push(href)
    }
  }
}

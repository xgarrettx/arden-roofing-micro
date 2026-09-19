import axios from 'axios'
import { API_BASE_URL, SSR_API_BASE_URL } from '@/global/consts/api.consts'

const instance = axios.create({
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
  // During vite-ssg's prerender pass (Node, no `window`), prefer
  // VITE_BUILD_API_URL if it's set — the build machine should talk to the
  // backend directly over localhost rather than round-trip through the
  // public domain/CDN. The actual browser bundle always uses API_BASE_URL
  // (the public URL), since SSR_API_BASE_URL only exists when window is
  // undefined, which is never true in a real browser.
  baseURL: (typeof window === 'undefined' && SSR_API_BASE_URL) || API_BASE_URL,
  timeout: 60000,
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error)
  },
)

export default instance

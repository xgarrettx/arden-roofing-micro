// This file replaces the guideline's plain `createApp(...).mount()` bootstrap
// with `ViteSSG(...)`, per the project's decision to prerender every route
// (including the 35 location pages and 3 service pages) to static HTML for
// SEO, instead of shipping a client-only SPA. vite-ssg owns creating the
// vue-router instance from `routes` (memory history during the prerender
// build, web history in the browser) — everything else below (Pinia,
// PrimeVue, event buses, directives, globally registered components)
// follows the guideline's main.js exactly.
import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { setGlobalOptions } from 'vue-request'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import 'remixicon/fonts/remixicon.css'
import '@/styles/main.scss'

import App from '@/App.vue'
import { routes } from '@/router'
import { toastBus } from '@/global/toast.bus'
import { modalsBus } from '@/global/modals.bus'
import { refreshBus } from '@/global/refresh.bus'

// vue-request: manual: true by default — requests only run when explicitly called
setGlobalOptions({ manual: true })

export const createApp = ViteSSG(App, { routes }, ({ app }) => {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  // vite-ssg creates and installs the @unhead/vue head instance itself
  // (client build on the browser, server build during prerender) — see its
  // `useHead` option (on by default). `useSeoMeta.js`'s `useHead()` calls
  // in each page just plug into that instance.
  app
    .use(PrimeVue, { ripple: true })
    .use(ToastService)
    .use(ConfirmationService)

  // Make buses available via inject() in any component
  app.provide('toastBus', toastBus)
  app.provide('modalsBus', modalsBus)
  app.provide('refreshBus', refreshBus)

  // Global directives
  app.directive('tooltip', Tooltip)

  // Globally registered components (used on nearly every page)
  app.component('Button', Button)
  app.component('InputText', InputText)
})

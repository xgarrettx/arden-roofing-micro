# Vue 3 Frontend Guidelines

Follow these patterns and conventions consistently when building or modifying any part of this frontend.

---

## Project Setup (from scratch)

When starting a new project, follow these steps in order. Every piece here is required — do not skip any step.

### 1. Scaffold the project

```bash
npm create vite@latest my-app -- --template vue
cd my-app
```

### 2. Install dependencies

```bash
npm install vue-router@4 pinia pinia-plugin-persistedstate axios vue-request @vuelidate/core @vuelidate/validators luxon decimal.js mitt

npm install -D primevue@3 primeflex primeicons remixicon sass
```

### 3. Configure Vite

Replace `vite.config.js` with this — it sets up the `@/` alias and loads env variables:

```js
// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [vue()],
    server: {
      host: '127.0.0.1',
      port: Number(process.env.VITE_APP_DEV_PORT) || 3000,
    },
    resolve: {
      alias: { '@': resolve(__dirname, './src') },
    },
  })
}
```

### 4. Create the folder structure

Create the following directories inside `src/`:

```
src/
├── components/
├── composables/
├── global/
│   └── consts/
├── pages/
├── router/
├── services/
├── store/
├── styles/
└── utils/
```

### 5. Set up environment variables

Create two files at the project root:

```bash
# .env.example — commit this, placeholder values, add a comment for each variable
# Port for the local dev server
VITE_APP_DEV_PORT=3000
# Base URL of the backend API
VITE_API_URL=https://api.yourapp.com
```

```bash
# .env — never commit this, real values only
VITE_APP_DEV_PORT=3000
VITE_API_URL=https://api.yourapp.com
```

Make sure `.env` is listed in `.gitignore`:

```
node_modules
dist
.env
.DS_Store
```

### 6. Create the API constants file

```js
// src/global/consts/api.consts.js
export const API_BASE_URL = import.meta.env.VITE_API_URL

export const API_ROUTES = {
  // Add routes here as you build features
  // Example:
  // USERS: {
  //   BASE: '/users',
  //   LIST: '/users',
  // },
}
```

### 7. Create the ApiService

This is the single axios instance the whole app uses. All requests go through here.

```js
// src/services/api.service.js
import axios from 'axios'
import { API_BASE_URL } from '@/global/consts/api.consts.js'

const instance = axios.create({
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  baseURL: API_BASE_URL,
  timeout: 60000,
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 globally here if needed (e.g. redirect to login)
    return Promise.reject(error)
  }
)

export default instance
```

### 8. Create the event buses

```js
// src/global/toast.bus.js
import mitt from 'mitt'
export const toastBus = mitt()

// src/global/modals.bus.js
import mitt from 'mitt'
export const modalsBus = mitt()

// src/global/refresh.bus.js
import mitt from 'mitt'
export const refreshBus = mitt()
```

### 9. Set up the router

```js
// src/router/constants.js
export const ROUTES = {
  HOME: 'home',
  // Add route names here as you build pages
}
```

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { ROUTES } from '@/router/constants'

const routes = [
  {
    path: '/',
    name: ROUTES.HOME,
    component: () => import('@/pages/HomePage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
```

### 10. Set up Pinia

```js
// src/store/app.store.js — a minimal example store to start with
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const state = reactive({
    ready: false,
  })

  return { ...toRefs(state) }
}, { persist: false })
```

### 11. Wire everything up in main.js

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { setGlobalOptions } from 'vue-request'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/aura-light-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import 'remixicon/fonts/remixicon.css'

import App from '@/App.vue'
import { router } from '@/router'
import { toastBus } from '@/global/toast.bus'
import { modalsBus } from '@/global/modals.bus'
import { refreshBus } from '@/global/refresh.bus'

// vue-request: manual: true by default — requests only run when explicitly called
setGlobalOptions({ manual: true })

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app
  .use(pinia)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
  .use(ConfirmationService)
  .use(DialogService)

// Make buses available via inject() in any component
app.provide('toastBus', toastBus)
app.provide('modalsBus', modalsBus)
app.provide('refreshBus', refreshBus)

// Global directives
app.directive('tooltip', Tooltip)

// Globally registered components (use sparingly — only for very frequent primitives)
app.component('Button', Button)
app.component('InputText', InputText)

app.mount('#app')
```

### 12. Create a base App.vue

```vue
<!-- src/App.vue -->
<script setup>
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <RouterView />
</template>
```

At this point the project is ready to build features. Follow the rest of this document for all patterns going forward.

---

## Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Build tool**: Vite
- **State management**: Pinia
- **UI library**: PrimeVue
- **Layout/utilities**: PrimeFlex
- **HTTP**: Axios (via a shared `ApiService` wrapper)
- **Async requests**: `vue-request` (`useRequest`)
- **Validation**: Vuelidate (`@vuelidate/core`)
- **Date/time**: Luxon (never raw `Date`)
- **Decimal math**: `decimal.js` (never floating point for money)

---

## Project Structure

```
src/
├── main.js                  # App bootstrap
├── App.vue                  # Root component
├── router/
│   ├── index.js             # Vue Router config
│   └── constants.js         # Route name constants (ROUTES.*)
├── store/                   # Pinia stores — one file per domain
├── services/                # All API calls — grouped by domain
│   ├── api.service.js       # Shared Axios wrapper (never import axios directly)
│   ├── api.wrapper.js       # Response/error normalization
│   ├── auth.service.js
│   └── [domain]/            # Domain-specific services (e.g. owners/, clients/)
│       └── [entity].service.js
├── composables/             # Reusable Vue logic (use* functions)
├── utils/                   # Pure helper functions, no Vue state
├── global/
│   └── consts/
│       └── api.consts.js    # All API route strings (API_ROUTES.*)
├── pages/                   # Route-level screens — thin, delegate to components
│   └── [role]/              # Grouped by user role (owner/, client/, admin/)
└── components/              # All reusable and feature UI
    ├── [SharedComponent].vue  # Truly generic components at root level
    └── [feature]/             # Feature-scoped components grouped by domain
        ├── FeatureSection.vue        # Top-level section (data + layout)
        ├── FeatureCard.vue           # Display/list item
        ├── FeatureModal.vue          # Modal for create/edit
        └── FeatureDeleteModal.vue    # Dedicated confirmation modals
```

Place pages in `src/pages/` and keep them thin — they hold top-level state and delegate all UI to components. Place all reusable or feature UI in `src/components/`, grouped by feature domain, never by UI type. Do not create top-level `modals/`, `cards/`, or `forms/` folders.

A section component (e.g. `FeatureSection.vue`) owns layout and coordinates its children. It receives data via props and emits user actions up. A card/item component (e.g. `FeatureCard.vue`) is purely presentational — receives one entity and emits events (`view`, `remove`, etc.).

---

## Component Design

### Split proactively

Proactively split components rather than waiting to be asked. A component over ~200 lines of template or ~150 lines of script must be split. When implementing a new feature, default to multiple small focused components over one large one.

Extract a block into its own component if any of these are true:
- It could be reused somewhere else.
- It has its own state or a distinct responsibility.
- Naming it would make the parent easier to read.

### Component file structure

Always follow this order inside `<script setup>`:

```vue
<script setup>
// 1. Imports
import { ref, reactive, computed, onBeforeMount } from 'vue'
import Button from 'primevue/button'
import MyChildComponent from '@/components/feature/MyChildComponent.vue'
import { MyService } from '@/services/my.service.js'

// 2. Constants (module-level, never change)
const MAX_ITEMS = 50

// 3. Props and emits
const props = defineProps({ ... })
const emit = defineEmits([...])

// 4. Composables and stores
const myStore = useMyStore()
const { pagination, nextPage } = usePagination(...)

// 5. State
const state = reactive({ ... })
const modalOpen = ref(false)

// 6. Computed
const filteredItems = computed(() => ...)

// 7. Watchers
watch(() => props.id, loadData)

// 8. Lifecycle
onBeforeMount(() => { loadData() })

// 9. Methods
function loadData() { ... }
function onSubmit() { ... }
</script>
```

### Props

Always use explicit, named props — never opaque config objects. Always declare `type` and `required` or `default`. Prefer primitives and flat shapes over deeply nested objects.

```js
// Good
defineProps({
  title: { type: String, required: true },
  loading: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
})

// Avoid — opaque, hard to validate
defineProps({
  config: { type: Object, required: true },
})
```

### Emits

Always declare emits with `defineEmits`. Use kebab-case event names: `@close`, `@submit`, `@item-selected`. Emit plain values — not DOM events or internal state objects.

### Consistency

When editing an existing component, match the style and patterns of the file — even if the surrounding code is older or less consistent than these guidelines. Do not mix styles within the same file.

### State

Use `reactive({})` for grouped form/UI state. Use `ref()` for primitives and standalone flags. Group related fields into one `reactive` object rather than scattering them across individual `ref`s.

```js
// Good — grouped
const form = reactive({ name: '', email: '', role: '' })
const isSubmitting = ref(false)

// Avoid — scattered
const name = ref('')
const email = ref('')
const role = ref('')
```

---

## Service Layer

Every API call lives in `src/services/`, grouped by domain. Services are the **only** layer that talks to the backend.

### Call chain

```
Component
  └── useRequest(ServiceClass.method)
        └── ServiceClass.method({ camelCaseArgs })
              └── ApiService.get/post/patch/delete(route, snakeCasePayload)
                    └── axios (via api.service.js + api.wrapper.js)
```

`ApiService` handles auth headers, base URL, and response normalization. Never import `axios` directly in components or services.

### Service file pattern

```js
// src/services/users/user.service.js
import ApiService from '@/services/api.service'
import { API_ROUTES } from '@/global/consts/api.consts'

export class UserService {
  static getAll() {
    return ApiService.get(API_ROUTES.USERS.LIST)
  }

  static getById(id) {
    return ApiService.get(`${API_ROUTES.USERS.BASE}/${id}`)
  }

  static create({ name, email, roleId }) {
    return ApiService.post(API_ROUTES.USERS.BASE, {
      name,
      email,
      role_id: roleId,   // camelCase in, snake_case out — mapping lives here
    })
  }

  static update({ id, name, email }) {
    return ApiService.patch(`${API_ROUTES.USERS.BASE}/${id}`, { name, email })
  }

  static remove(id) {
    return ApiService.delete(`${API_ROUTES.USERS.BASE}/${id}`)
  }
}
```

### API routes

All route strings live in `src/global/consts/api.consts.js`. Never hardcode paths inline in components or services.

```js
export const API_ROUTES = {
  USERS: {
    BASE: '/users',
    LIST: '/users',
    SETTINGS: '/users/settings',
  },
  ORDERS: {
    BASE: '/orders',
    DETAIL: (id) => `/orders/${id}`,  // dynamic segments use a function
  },
}
```

When adding a new endpoint, add it to `api.consts.js` first, then reference it from the service. Extend an existing service class rather than creating a new one for the same domain.

---

## Data Fetching with `vue-request`

Use `useRequest` for all async operations. It provides reactive `data`, `loading`, and `error` state automatically.

```js
import { useRequest } from 'vue-request'
import { UserService } from '@/services/users/user.service.js'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Auto-runs on mount
const { data: usersData, loading: loadingUsers, run: reload } =
  useRequest(UserService.getAll)

// Manual — only runs when explicitly called
const { loading: saving, run: saveReq, error: saveError } =
  useRequest(UserService.create, { manual: true })

async function onSubmit() {
  await saveReq({ name: form.name, email: form.email })

  if (saveError.value) {
    toast.add({
      summary: saveError.value?.data?.message || 'Something went wrong',
      severity: 'error',
      life: 5000,
    })
    return
  }

  toast.add({ summary: 'Saved successfully', severity: 'success', life: 3000 })
  await reload()
}

// Safely unwrap response data
const users = computed(() =>
  Array.isArray(usersData.value?.data) ? usersData.value.data : []
)
```

- Rename destructured fields to be semantic: `loading: saving`, `run: saveReq`, `error: saveError`.
- Always check `error.value` after `await run()` before treating the call as a success.
- Use `{ manual: true }` for any operation triggered by user interaction.
- Response payload is at `data.value?.data` — the outer `data` is the `useRequest` ref, `.data` is the API body.
- Always read API payloads defensively: use optional chaining and fallbacks for any field that may be missing or incomplete. Default arrays to `[]`, objects to `{}`, strings to `''`.

---

## Composables

Composables live in `src/composables/` and follow the `use*` naming convention. A composable must encapsulate stateful logic that is reusable across components, return reactive state and functions only, and have no side effects on import.

```js
// src/composables/useConfirmDelete.js
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'

export function useConfirmDelete({ header, message, onAccept }) {
  const confirm = useConfirm()
  const deleting = ref(false)

  function ask() {
    confirm.require({
      header,
      message,
      icon: 'pi pi-exclamation-triangle',
      rejectLabel: 'Cancel',
      acceptLabel: 'Delete',
      rejectClass: 'p-button-secondary p-button-outlined',
      acceptClass: 'p-button-danger',
      accept: async () => {
        deleting.value = true
        await onAccept()
        deleting.value = false
      },
    })
  }

  return { deleting, ask }
}
```

Do not put API calls or router navigation inside a composable — keep those in the component or service layer.

---

## Pinia Stores

Stores live in `src/store/`, one file per domain. Use the setup store syntax.

```js
// src/store/user.store.js
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    id: null,
    name: '',
    email: '',
    loaded: false,
  })

  function setUser(user) {
    state.id = user.id
    state.name = user.name
    state.email = user.email
    state.loaded = true
  }

  function reset() {
    state.id = null
    state.name = ''
    state.email = ''
    state.loaded = false
  }

  return { ...toRefs(state), setUser, reset }
})
```

Only store shared application state that multiple components need. Local UI state (modal open, form dirty) belongs in the component. Use `$patch` for partial updates from outside the store.

---

## Validation with Vuelidate

```js
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const form = reactive({ name: '', email: '' })
const rules = { name: { required }, email: { required, email } }
const v$ = useVuelidate(rules, form)

async function onSubmit() {
  if (!await v$.value.$validate()) return
  // proceed
}
```

Validate on submit, not on every keystroke, unless immediate feedback is clearly needed. Display errors per-field near the input, not in a summary banner.

---

## Routing

All route name constants live in `src/router/constants.js`. Never hardcode route names or paths inline.

```js
// Good
router.push({ name: ROUTES.SETTINGS.STRIPE })

// Avoid
router.push('/settings/stripe')
```

Use `<RouterLink :to="{ name: ROUTES.DASHBOARD }">` in templates.

---

## Event Bus Patterns

Use the established event buses for cross-component communication that cannot go through props/emits:

- `toastBus` — show toast notifications
- `modalsBus` — open/close globally managed modals
- `refreshBus` — trigger data refreshes across unrelated components

Do not introduce new bus channels. Most cross-component needs are better solved with props, emits, or a shared Pinia store.

---

## Styling

Always reach for PrimeFlex before writing any CSS. Add `<style scoped>` only when PrimeFlex is insufficient, a custom visual treatment is required, or a targeted third-party override is needed.

```html
<!-- Layout -->
<div class="flex align-items-center justify-content-between gap-3">

<!-- Spacing -->
<div class="p-3 mt-2 mb-4">

<!-- Typography -->
<p class="text-sm text-600 font-semibold">

<!-- Responsive -->
<div class="col-12 md:col-6 lg:col-4">
```

---

## Environment Variables

All environment variables are defined in a `.env` file at the project root and must start with `VITE_` to be accessible in the browser. Access them in code via `import.meta.env.VITE_*`.

```js
const apiUrl = import.meta.env.VITE_API_URL
```

When adding a new variable:
1. Add it to `.env` with the real value (this file is gitignored and never committed).
2. Add it to `.env.example` with a placeholder value and a comment explaining what it is. This file is committed and acts as the reference for anyone setting up the project.

```bash
# .env.example — committed, placeholder values, comments welcome
# Base URL for the backend API
VITE_API_URL=https://api.yourapp.com
# Public key for the payment provider
VITE_STRIPE_PUBLIC_KEY=pk_test_replace_me
```

```bash
# .env — never committed, real values, no comments needed
VITE_API_URL=https://api.yourapp.com
VITE_STRIPE_PUBLIC_KEY=pk_live_abc123...
```

Only public-facing values belong in the frontend `.env` — the contents are bundled into the browser and readable by anyone. Anything that grants billing or admin access belongs on the backend only.

---

## Security

Security must be considered by default, not added as an afterthought. The frontend is the layer closest to the end user — mistakes here can directly expose their data.

### Never trust user input

Always validate and sanitize anything that comes from a user before using it. Vuelidate handles form validation, but also be careful about how data is rendered.

Never use `v-html` with content that came from a user or an external source — it opens the door to XSS attacks (malicious scripts injected into the page). If rich text rendering is genuinely needed, sanitize the content first with a library like `DOMPurify`.

```html
<!-- NEVER do this with user-provided content -->
<div v-html="userComment" />

<!-- Safe: bind as text, not HTML -->
<div>{{ userComment }}</div>
```

### Never store sensitive data in the browser

Do not store passwords, tokens, personal data, or anything sensitive in `localStorage` or `sessionStorage`. These are accessible by any JavaScript running on the page and are not secure storage. Use session cookies (managed by the backend) for authentication.

```js
// Never do this
localStorage.setItem('token', userToken)
localStorage.setItem('user_email', email)
```

### Never log sensitive data

Do not use `console.log` with passwords, tokens, API keys, or personal user data. Logs can be captured by browser extensions, monitoring tools, or accidentally left visible in production.

```js
// Never do this
console.log('User data:', { email, password, token })
```

### Do not expose internal details in error messages

Show the user a friendly, generic message when something goes wrong. Never surface raw API error bodies, stack traces, or internal field names directly in the UI — they reveal implementation details that can be exploited.

```js
// Good — friendly and safe
toast.add({ summary: 'Something went wrong. Please try again.', severity: 'error' })

// Avoid — leaks internals
toast.add({ summary: error.response.data.stack, severity: 'error' })
```

Use the error message from the backend only if it was explicitly designed to be shown to users.

### Keep dependencies updated

Outdated packages are one of the most common sources of security vulnerabilities. Regularly run:

```bash
npm audit
```

Fix any high or critical vulnerabilities before shipping. Do not ignore audit warnings.

### Only collect what you need

Do not collect, store, or transmit personal user data (names, emails, addresses, payment info) beyond what the feature strictly requires. Over-collection creates unnecessary liability. If in doubt, ask before building.

---

## Git Safety

Before staging any files, always verify what is about to be committed. The following must never be committed:

| File | Reason |
|---|---|
| `.env` | Contains real secrets and API keys |
| `node_modules/` | Auto-generated, restored via `npm install` |
| `dist/` | Build output, regenerated on deploy |
| `.DS_Store` | macOS system metadata |

All of these are already listed in `.gitignore`. Do not force-add them.

When preparing a commit, never stage `.env` or any file not intentionally changed. If a secret was accidentally committed, treat the key as compromised and rotate it immediately.

---

## Key Rules

1. **One responsibility per component.** If a component does two unrelated things, split it.
2. **Short files.** A component over ~200 lines of template or ~150 lines of script must be split into sub-components or composables.
3. **Services own all API calls.** Never use `axios` or `fetch` directly in components or pages.
4. **Pages are thin.** They fetch data and hold top-level state — all UI is delegated to child components.
5. **Reuse before building.** Check existing components, composables, and services before creating new ones. If the stack already has a library that solves the problem (PrimeVue, Vuelidate, vue-request, Luxon, etc.), use it — never build from scratch what a dependency already provides.
6. **Group by feature, not type.** Component folders are grouped by domain (`settings/`, `billing/`), not by `modals/`, `forms/`, `cards/`.
7. **PrimeFlex first.** Always use a utility class before writing scoped CSS.
8. **Constants over magic strings.** Route paths, API endpoints, and repeated values go in constants files.
9. **`reactive` for form state, `ref` for flags.** Never scatter a single form's fields across multiple `ref`s.
10. **Check errors explicitly.** After every `useRequest` `run()` call, check `error.value` before treating the operation as a success.
11. **Pass only what is needed.** Never pass a whole object as a prop when the child only needs one or two fields. Keep the data flowing down as narrow as possible.
12. **Read API responses defensively.** Always use optional chaining and fallbacks — never assume a field exists. Default to `[]`, `{}`, or `''` as appropriate.
13. **Secrets live in `.env`, never in code.** Never stage `.env`. Keep `.env.example` up to date with placeholder values and explanatory comments.
14. **Security by default.** Never use `v-html` with user content, never store sensitive data in `localStorage`, never log personal data, never expose raw error internals to the UI. When in doubt, the safer option is always correct.

import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

// Minimal app-wide store per the guideline's starter shape. This marketing
// site has almost no cross-page shared state (no auth/session), so this
// currently only tracks whether the mobile nav is open — kept as a Pinia
// store rather than component-local state because SiteHeader and the nav
// overlay need to agree on it without a prop/emit chain.
export const useAppStore = defineStore(
  'app',
  () => {
    const state = reactive({
      mobileNavOpen: false,
    })

    function toggleMobileNav() {
      state.mobileNavOpen = !state.mobileNavOpen
    }

    function closeMobileNav() {
      state.mobileNavOpen = false
    }

    return { ...toRefs(state), toggleMobileNav, closeMobileNav }
  },
  { persist: false },
)

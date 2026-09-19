<script setup>
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
</script>

<template>
  <Toast />
  <ConfirmDialog />
  <div class="site-shell">
    <SiteHeader />
    <main class="site-main">
      <!--
        Pages that load their content from the API (locations, services,
        team) do it with a top-level `await` in <script setup>, which makes
        them async components. Suspense is what lets vite-ssg wait for that
        data during prerendering instead of shipping an empty shell — without
        it, `vite-ssg build` would emit static HTML before the fetch
        resolved. `:key="route.fullPath"` forces a remount (and a fresh
        fetch) when only the route params change, e.g. navigating from
        /service-areas/arden to /service-areas/asheville, which vue-router
        would otherwise handle by reusing the same component instance.
      -->
      <RouterView v-slot="{ Component, route }">
        <Suspense timeout="0">
          <component :is="Component" :key="route.fullPath" />
          <template #fallback>
            <div class="wrap" style="padding: 120px 20px; text-align: center">Loading…</div>
          </template>
        </Suspense>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>

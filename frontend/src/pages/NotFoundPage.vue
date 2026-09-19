<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ROUTES } from '@/router/constants'
import { useSeoMeta } from '@/composables/useSeoMeta'

useSeoMeta({
  title: 'Page Not Found | Arden Roofing',
  description: 'The page you were looking for could not be found.',
  path: computed(() => '/404'),
})
</script>

<template>
  <section class="section">
    <div class="wrap article" style="text-align: center">
      <h1>Page Not Found</h1>
      <p class="section__lead" style="margin: 0 auto 24px">
        We couldn't find that page. It may have moved, or the link may be out of date.
      </p>
      <RouterLink class="btn" :to="{ name: ROUTES.HOME }">Back to Home</RouterLink>
    </div>
  </section>
</template>

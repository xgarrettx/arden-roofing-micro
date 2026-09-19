<script setup>
// Renders long-form static content (About, Careers, the legal pages) that
// was ported from the original site's HTML. The content is our own trusted
// copy (not user input), so v-html is safe here — see the Vue frontend
// guidelines' note that v-html is only dangerous with user-supplied content.
import { useInternalLinkClick } from '@/composables/useInternalLinks'

defineProps({
  title: { type: String, required: true },
  introHtml: { type: String, default: '' },
  lastUpdated: { type: String, default: '' },
  bodyHtml: { type: String, required: true },
})

const onClick = useInternalLinkClick()
</script>

<template>
  <section class="section">
    <div class="wrap article" @click="onClick">
      <h1>{{ title }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="introHtml" />
      <p v-if="lastUpdated" class="muted article__date">Last updated: {{ lastUpdated }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="bodyHtml" />
    </div>
  </section>
</template>

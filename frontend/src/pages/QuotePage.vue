<script setup>
import { computed } from 'vue'
import QuoteWizard from '@/components/quote/QuoteWizard.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'

useSeoMeta({
  title: 'Get a Free Roofing Quote | Arden Roofing',
  description:
    'Answer a few quick questions and compare free roofing quotes from Arden Roofing and trusted local partners serving Asheville, NC.',
  path: computed(() => '/quote'),
})
</script>

<template>
  <section class="section quote-page-section">
    <QuoteWizard />
  </section>
</template>

<style scoped>
/* The site-wide .section class carries its own top/bottom padding, which is
   fine when a page has multiple stacked sections but reads as a lot of dead
   space above and below a single full-page wizard like this one. Kept the
   .section class for whatever base styling it carries (background, etc.)
   and just override its vertical padding here. !important because I don't
   have the global stylesheet's .section rule in front of me to confirm its
   specificity — safe to drop once that's not a concern. */
.quote-page-section {
  padding-top: 20px !important;
  padding-bottom: 20px !important;
}
</style>

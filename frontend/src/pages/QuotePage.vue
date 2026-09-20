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
  <section class="section">
    <QuoteWizard />
  </section>
</template>

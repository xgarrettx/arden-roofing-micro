<script setup>
import { computed } from 'vue'
import FaqAccordion from '@/components/shared/FaqAccordion.vue'
import CtaBand from '@/components/shared/CtaBand.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import faqData from '@/data/faq.json'

useSeoMeta({
  title: faqData.meta_title,
  description: faqData.meta_description,
  path: computed(() => '/faq'),
})
</script>

<template>
  <section class="section">
    <div class="wrap article faq-page">
      <h1>{{ faqData.h1 }}</h1>
      <div class="section__lead article__lead"><p>{{ faqData.intro }}</p></div>
      <FaqAccordion :items="faqData.items" />
    </div>
  </section>
  <CtaBand
    heading="Contact Us Today for a Free Estimate"
    text="Still have a question? Call us and we're glad to walk through it."
  />
</template>

<script setup>
import { computed } from 'vue'
import LeadFormCard from '@/components/shared/LeadFormCard.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { SITE } from '@/global/consts/site.consts'
import simpleIntros from '@/data/simple_intros.json'

const intro = simpleIntros.estimate

useSeoMeta({
  title: intro.meta_title,
  description: intro.meta_description,
  path: computed(() => '/estimate'),
})
</script>

<template>
  <section class="section">
    <div class="wrap split">
      <div>
        <h1>{{ intro.h1 }}</h1>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="intro.intro_html" />
        <p style="margin-top: 18px">
          Prefer to talk now? Call <a class="wc-phone" :href="SITE.phoneHref"><strong>{{ SITE.phoneDisplay }}</strong></a>.
        </p>
        <p class="muted">Free &mdash; no obligations.</p>
      </div>
      <LeadFormCard source="estimate" submit-label="Request My Free Estimate" />
    </div>
  </section>
</template>

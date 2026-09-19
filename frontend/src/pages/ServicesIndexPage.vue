<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ROUTES } from '@/router/constants'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { SERVICE_SUMMARIES } from '@/global/consts/services.consts'
import simpleIntros from '@/data/simple_intros.json'

const intro = simpleIntros.services_index

useSeoMeta({
  title: intro.meta_title,
  description: intro.meta_description,
  path: computed(() => '/services'),
})
</script>

<template>
  <section class="section">
    <div class="wrap">
      <h1>{{ intro.h1 }}</h1>
      <div class="section__lead" style="margin-top: 18px">
        <p>
          Whether your roof needs a small repair or a full replacement, Arden Roofing focuses on the work
          required to keep the home protected without making the process more complicated than it needs to be.
        </p>
      </div>
      <div style="margin-top: 28px">
        <div class="grid grid--3">
          <div v-for="service in SERVICE_SUMMARIES" :key="service.slug" class="card">
            <h3>{{ service.label }}</h3>
            <p>{{ service.teaser }}</p>
            <RouterLink :to="{ name: ROUTES.SERVICE_DETAIL, params: { serviceSlug: service.slug } }">
              Learn more &rarr;
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

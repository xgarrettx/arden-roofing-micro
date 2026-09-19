<script setup>
import { computed } from 'vue'
import { useRequest } from 'vue-request'
import ServiceAreasList from '@/components/location/ServiceAreasList.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { LocationService } from '@/services/content/location.service'
import simpleIntros from '@/data/simple_intros.json'

const { data: locationsRes, runAsync: loadLocations } = useRequest(LocationService.getAll, { manual: true })
await loadLocations()
const locations = computed(() => (Array.isArray(locationsRes.value?.data) ? locationsRes.value.data : []))

const intro = simpleIntros.service_areas

useSeoMeta({
  title: intro.meta_title,
  description: intro.meta_description,
  path: computed(() => '/service-areas'),
})
</script>

<template>
  <section class="section">
    <div class="wrap">
      <h1>{{ intro.h1 }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div style="margin-top: 18px" v-html="intro.intro_html" />
      <div style="margin-top: 28px">
        <ServiceAreasList :locations="locations" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRequest } from 'vue-request'
import LeadFormCard from '@/components/shared/LeadFormCard.vue'
import ServiceAreasList from '@/components/location/ServiceAreasList.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { LocationService } from '@/services/content/location.service'
import { SITE } from '@/global/consts/site.consts'
import simpleIntros from '@/data/simple_intros.json'

const { data: locationsRes, runAsync: loadLocations } = useRequest(LocationService.getAll, { manual: true })
await loadLocations()
const locations = computed(() => (Array.isArray(locationsRes.value?.data) ? locationsRes.value.data : []))

const intro = simpleIntros.contact

useSeoMeta({
  title: intro.meta_title,
  description: intro.meta_description,
  path: computed(() => '/contact'),
})
</script>

<template>
  <section class="section">
    <div class="wrap split">
      <div>
        <h1>{{ intro.h1 }}</h1>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="intro.intro_html" />
        <ul class="contact-list">
          <li>
            <strong>Phone</strong><br />
            <a class="wc-phone" :href="SITE.phoneHref">{{ SITE.phoneDisplay }}</a><br />
            <span class="muted">Fastest way to reach us. If we are on a job, leave a message and we call back.</span>
          </li>
          <li>
            <strong>Email</strong><br />
            <a :href="`mailto:${SITE.email}`">{{ SITE.email }}</a><br />
            <span class="muted">Good for photos, documents, and anything that is not urgent.</span>
          </li>
          <li>
            <strong>Service area</strong><br />
            Asheville, {{ SITE.addressRegion }}<br />
            <span class="muted">We come to you. This is a service-area business. We do not operate a staffed office in {{ SITE.addressLocality }}, {{ SITE.addressRegion }}.</span>
          </li>
        </ul>
      </div>
      <LeadFormCard source="contact" submit-label="Send Message" />
    </div>
  </section>

  <section class="section section--alt">
    <div class="wrap">
      <h2 class="center">Where We Work</h2>
      <p class="section__lead center" style="margin-bottom: 22px">Serving Asheville, NC and the surrounding communities.</p>
      <ServiceAreasList :locations="locations" />
    </div>
  </section>
</template>

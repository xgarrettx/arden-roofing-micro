<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import HeroSection from '@/components/shared/HeroSection.vue'
import FeatureGrid from '@/components/shared/FeatureGrid.vue'
import CtaBand from '@/components/shared/CtaBand.vue'
import ServiceAreasList from '@/components/location/ServiceAreasList.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { buildGraph, buildLocalBusinessNode, buildWebsiteNode, buildBreadcrumbList } from '@/utils/schema'
import { LocationService } from '@/services/content/location.service'
import { ROUTES } from '@/router/constants'
import { SERVICE_SUMMARIES } from '@/global/consts/services.consts'

const route = useRoute()
const router = useRouter()

const { data: locationRes, runAsync: loadLocation } = useRequest(LocationService.getBySlug, { manual: true })
const { data: allLocationsRes, runAsync: loadAllLocations } = useRequest(LocationService.getAll, { manual: true })

try {
  await Promise.all([loadLocation(route.params.citySlug), loadAllLocations()])
} catch (err) {
  router.replace({ name: ROUTES.NOT_FOUND })
}

const location = computed(() => locationRes.value?.data)
const allLocations = computed(() => (Array.isArray(allLocationsRes.value?.data) ? allLocationsRes.value.data : []))
const path = computed(() => `/service-areas/${route.params.citySlug}`)

useSeoMeta({
  title: computed(() => location.value?.meta_title || 'Arden Roofing'),
  description: computed(() => location.value?.meta_description || ''),
  path,
  jsonLd: computed(() =>
    location.value
      ? buildGraph([
          buildLocalBusinessNode(allLocations.value.map((l) => l.city_name)),
          buildWebsiteNode(),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Service Areas', path: '/service-areas' },
            { name: location.value.city_name, path: path.value },
          ]),
        ])
      : null,
  ),
})
</script>

<template>
  <template v-if="location">
    <HeroSection
      :eyebrow="location.hero_eyebrow"
      :title="location.hero_h1"
      :intro="location.hero_intro"
      :image-alt="location.hero_image_alt"
    />

    <section class="section">
      <div class="wrap">
        <h2>{{ location.intro_heading }}</h2>
        <div class="section__lead">
          <p v-for="(paragraph, index) in location.intro_paragraphs" :key="index">{{ paragraph }}</p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2 class="center">Our Services in {{ location.city_name }}</h2>
        <div style="margin-top: 24px">
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

    <section class="section" style="padding: 18px 0">
      <div class="wrap">
        <img src="/assets/images/img-2.jpg" :alt="location.hero_image_alt" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2>{{ location.why_heading }}</h2>
        <div style="margin-top: 24px">
          <FeatureGrid :items="location.why_items" :columns="2" />
        </div>
      </div>
    </section>

    <CtaBand :heading="location.cta_heading" :text="location.cta_text" />

    <section class="section" style="padding: 18px 0">
      <div class="wrap">
        <img src="/assets/images/img-3.jpg" :alt="location.hero_image_alt" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2 class="center">Nearby Areas We Serve</h2>
        <div style="margin-top: 24px">
          <ServiceAreasList :locations="allLocations" :exclude-slug="route.params.citySlug" />
        </div>
      </div>
    </section>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useRequest } from 'vue-request'
import HeroSection from '@/components/shared/HeroSection.vue'
import FeatureGrid from '@/components/shared/FeatureGrid.vue'
import CtaBand from '@/components/shared/CtaBand.vue'
import ServiceAreasList from '@/components/location/ServiceAreasList.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { buildGraph, buildLocalBusinessNode, buildWebsiteNode, buildServiceNode, buildBreadcrumbList } from '@/utils/schema'
import { ServiceCatalogService } from '@/services/content/service-catalog.service'
import { LocationService } from '@/services/content/location.service'
import { ROUTES } from '@/router/constants'
import { SERVICE_SUMMARIES } from '@/global/consts/services.consts'

const route = useRoute()
const router = useRouter()

const { data: serviceRes, runAsync: loadService } = useRequest(ServiceCatalogService.getBySlug, { manual: true })
const { data: locationsRes, runAsync: loadLocations } = useRequest(LocationService.getAll, { manual: true })

try {
  await Promise.all([loadService(route.params.serviceSlug), loadLocations()])
} catch (err) {
  router.replace({ name: ROUTES.NOT_FOUND })
}

const service = computed(() => serviceRes.value?.data)
const locations = computed(() => (Array.isArray(locationsRes.value?.data) ? locationsRes.value.data : []))
const otherServices = computed(() => SERVICE_SUMMARIES.filter((s) => s.slug !== route.params.serviceSlug))
const path = computed(() => `/services/${route.params.serviceSlug}`)

useSeoMeta({
  title: computed(() => service.value?.meta_title || 'Arden Roofing'),
  description: computed(() => service.value?.meta_description || ''),
  path,
  jsonLd: computed(() =>
    service.value
      ? buildGraph([
          buildLocalBusinessNode(locations.value.map((l) => l.city_name)),
          buildWebsiteNode(),
          buildServiceNode({ path: path.value, name: service.value.hero_h1, serviceType: service.value.hero_h1 }),
          buildBreadcrumbList([
            { name: 'Home', path: '/' },
            { name: 'Our Services', path: '/services' },
            { name: service.value.hero_h1, path: path.value },
          ]),
        ])
      : null,
  ),
})
</script>

<template>
  <template v-if="service">
    <HeroSection
      :eyebrow="service.hero_eyebrow"
      :title="service.hero_h1"
      :intro="service.hero_intro"
      :image-alt="service.hero_image_alt"
    />

    <section class="section">
      <div class="wrap">
        <h2>{{ service.intro_heading }}</h2>
        <div class="section__lead">
          <p v-for="(paragraph, index) in service.intro_paragraphs" :key="index">{{ paragraph }}</p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2 class="center">Arden Roofing Is Proud to Serve Asheville, NC</h2>
        <div style="margin-top: 24px">
          <ServiceAreasList :locations="locations" />
        </div>
      </div>
    </section>

    <section class="section" style="padding: 18px 0">
      <div class="wrap">
        <img src="/assets/images/img-4.jpg" :alt="service.hero_image_alt" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2>{{ service.highlights_heading }}</h2>
        <p class="section__lead">{{ service.highlights_intro }}</p>
        <div style="margin-top: 24px">
          <FeatureGrid :items="service.highlights_items" :columns="2" />
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2>{{ service.cost_heading }}</h2>
        <div class="table-wrap" style="margin-top: 18px">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Estimated Cost</th>
                <th>Average</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in service.cost_rows" :key="row.service">
                <td>{{ row.service }}</td>
                <td>{{ row.estimated_cost }}</td>
                <td>{{ row.average }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style="margin-top: 16px">{{ service.cost_disclaimer }}</p>
      </div>
    </section>

    <section class="section" style="padding: 18px 0">
      <div class="wrap">
        <img src="/assets/images/img-5.jpg" :alt="service.hero_image_alt" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2>{{ service.why_heading }}</h2>
        <div style="margin-top: 24px">
          <FeatureGrid :items="service.why_items" :columns="2" />
        </div>
      </div>
    </section>

    <CtaBand :heading="service.cta_heading" :text="service.cta_text" />

    <section class="section" style="padding: 18px 0">
      <div class="wrap">
        <img src="/assets/images/img-6.jpg" :alt="service.hero_image_alt" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2>{{ service.process_heading }}</h2>
        <div style="margin-top: 24px">
          <FeatureGrid :items="service.process_steps" :columns="2" />
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2 class="center">Our Other Services</h2>
        <div style="margin-top: 24px">
          <div class="grid grid--2">
            <div v-for="other in otherServices" :key="other.slug" class="card">
              <h3>{{ other.label }}</h3>
              <p>{{ other.teaser }}</p>
              <RouterLink :to="{ name: ROUTES.SERVICE_DETAIL, params: { serviceSlug: other.slug } }">
                Learn more &rarr;
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
</template>

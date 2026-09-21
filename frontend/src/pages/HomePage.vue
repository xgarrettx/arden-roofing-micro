<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useRequest } from 'vue-request'
import HeroSection from '@/components/shared/HeroSection.vue'
import FeatureGrid from '@/components/shared/FeatureGrid.vue'
import FaqAccordion from '@/components/shared/FaqAccordion.vue'
import CtaBand from '@/components/shared/CtaBand.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { buildGraph, buildLocalBusinessNode, buildWebsiteNode, buildServiceNode, buildOfferCatalog } from '@/utils/schema'
import { LocationService } from '@/services/content/location.service'
import { ROUTES } from '@/router/constants'
import { SERVICE_SUMMARIES } from '@/global/consts/services.consts'

const { data: locationsRes, runAsync: loadLocations } = useRequest(LocationService.getAll, { manual: true })
await loadLocations()
const locations = computed(() => (Array.isArray(locationsRes.value?.data) ? locationsRes.value.data : []))

const whyChooseUs = [
  { title: 'Clear explanations', text: 'We explain what we can see, what may be causing the problem, and which roofing options are reasonable before work begins.' },
  { title: 'Repair before replacement when appropriate', text: 'Not every roof issue calls for a complete replacement. When a practical repair is a reasonable option, we will discuss it.' },
  { title: 'Local weather awareness', text: 'Our work is shaped by the rain, wind, tree cover, slopes, and changing seasons common across the Asheville area.' },
  { title: 'Care around your property', text: 'Roofing is active construction work. We plan around landscaping, driveways, entrances, and cleanup so disruption stays manageable.' },
  { title: 'Consistent communication', text: 'We aim to keep homeowners informed about scheduling, discoveries on the roof, and the next step in the project.' },
]

const homeFaq = [
  {
    question: 'How do I know whether my roof needs repair or replacement?',
    answer_html:
      '<p>The answer depends on the age of the roof, the size and cause of the problem, and how much useful life the remaining roofing system appears to have. A localized issue may be repairable, while widespread wear, repeated leaks, or failing materials can make replacement the more practical long-term option.</p>',
  },
  {
    question: 'Can you find the source of a roof leak?',
    answer_html:
      '<p>We can inspect common leak sources such as damaged shingles, flashing, roof penetrations, valleys, and transitions. Water can travel before it becomes visible indoors, so the stain inside the house is not always directly below the entry point.</p>',
  },
  {
    question: 'How long does a typical roof replacement take?',
    answer_html:
      '<p>Many straightforward residential replacements can be completed within a relatively short construction window, but the exact schedule depends on roof size, pitch, access, material choice, decking conditions, and weather. We discuss the expected sequence before the project starts.</p>',
  },
  {
    question: 'Do you work outside Arden?',
    answer_html:
      '<p>Yes. Arden Roofing serves communities throughout the greater Asheville area and neighboring parts of Western North Carolina, including many towns in Buncombe, Henderson, Madison, and Haywood counties.</p>',
  },
]

useSeoMeta({
  title: 'Roofing Replacement & Repair in Arden & Asheville, NC | Arden Roofing',
  description:
    'Arden Roofing provides roof repair, installation, and replacement in Arden, Asheville, and surrounding Western North Carolina communities.',
  path: computed(() => '/'),
  jsonLd: computed(() => {
    const localBusiness = buildLocalBusinessNode(locations.value.map((l) => l.city_name))
    localBusiness.hasOfferCatalog = buildOfferCatalog(SERVICE_SUMMARIES)
    return buildGraph([
      localBusiness,
      buildWebsiteNode(),
      buildServiceNode({ path: '/', name: 'Roofing Replacement & Repair', serviceType: 'Roofing Replacement & Repair' }),
    ])
  }),
})
</script>

<template>
  <HeroSection
    eyebrow="Local Roofing Help in Western North Carolina"
    title="Roofing Replacement & Repair in Arden, NC"
    intro="Tell us what is happening with your roof and request an estimate."
    image-alt="Roofing Replacement &amp; Repair in Arden, NC"
  />

  <section class="section">
    <div class="wrap">
      <h2>Practical Roofing Help for Asheville-Area Homes</h2>
      <div class="section__lead">
        <p>
          A roof problem can be as obvious as a missing shingle or as subtle as a ceiling stain that only appears
          after a hard rain. Arden Roofing helps homeowners across Arden and the greater Asheville area understand
          what is happening overhead and decide whether a focused repair, a new installation, or a complete roof
          replacement makes sense.
        </p>
        <p>
          Our approach is simple: look carefully, explain what we find in plain language, and recommend work based
          on the condition of the roof rather than pushing every customer toward the largest project. From small
          leak investigations to aging roofs that are ready for replacement, we focus on sound preparation,
          dependable materials, and a jobsite that is treated with care.
        </p>
        <p><RouterLink class="btn" :to="{ name: ROUTES.QUOTE }">Get a Free Quote</RouterLink></p>
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="wrap">
      <h2>A Roofing Company Rooted in the Asheville Area</h2>
      <p>
        Arden Roofing was started by owner Caleb Whitaker after years of working on residential roofing crews
        throughout Buncombe and Henderson counties. Caleb grew up just south of Asheville and learned early that
        mountain weather puts roofs through a different mix of conditions than many homeowners expect: bright sun,
        sudden thunderstorms, wind, heavy rain, falling branches, and winter freeze-and-thaw cycles can all show up
        in the same year.
      </p>
      <p>
        He built Arden Roofing around the idea that homeowners should be able to get a useful explanation before
        making a major decision. Today, Caleb works alongside project lead Mason Greene and customer coordinator
        Emily Brooks. The three share the same straightforward approach: show up prepared, communicate clearly,
        protect the property, and leave customers with a roof plan they can understand.
      </p>
      <RouterLink class="btn" :to="{ name: ROUTES.ABOUT }">More about us</RouterLink>
    </div>
  </section>

  <section class="section" style="padding: 18px 0">
    <div class="wrap">
      <img src="/assets/images/img-1.jpg" alt="Arden Roofing Roofing Replacement &amp; Repair" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Our Services</h2>
      <p class="section__lead">
        Whether your roof needs a small repair or a full replacement, Arden Roofing focuses on the work required to
        keep the home protected without making the process more complicated than it needs to be.
      </p>
      <div style="margin-top: 28px">
        <div class="grid grid--3">
          <div v-for="service in SERVICE_SUMMARIES" :key="service.slug" class="card">
            <h3>{{ service.label }}</h3>
            <p>{{ service.teaser }}</p>
            <RouterLink :to="{ name: ROUTES.SERVICE_DETAIL, params: { serviceSlug: service.slug } }">Learn more &rarr;</RouterLink>
          </div>
        </div>
      </div>
      <p style="margin-top: 24px">
        <RouterLink class="btn btn--ghost" :to="{ name: ROUTES.SERVICES_INDEX }">View all services</RouterLink>
      </p>
    </div>
  </section>

  <section class="section section--alt">
    <div class="wrap">
      <h2>Where We Serve You</h2>
      <p>
        Arden Roofing serves homeowners throughout the Asheville region, including Arden, Asheville, Hendersonville,
        Fairview, Fletcher, Biltmore, West Asheville, Black Mountain, Mills River, Weaverville, Woodfin, Candler,
        Leicester, Swannanoa, Canton, and surrounding communities.
      </p>
      <p>
        Western North Carolina neighborhoods range from shaded mountain properties to exposed ridgelines and
        established in-town homes. Those differences can affect roof wear, drainage, debris buildup, wind exposure,
        and access. We consider the property itself when evaluating the roof rather than treating every house the
        same.
      </p>
      <RouterLink class="btn" :to="{ name: ROUTES.SERVICE_AREAS_INDEX }">See all service areas</RouterLink>
    </div>
  </section>

  <section class="section" style="padding: 18px 0">
    <div class="wrap">
      <img src="/assets/images/img-2.jpg" alt="Arden Roofing Roofing Replacement &amp; Repair" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <h2>Why Choose Arden Roofing?</h2>
      <div style="margin-top: 24px">
        <FeatureGrid :items="whyChooseUs" :columns="2" />
      </div>
    </div>
  </section>

  <section class="section section--alt">
    <div class="wrap">
      <h2 class="center">What People Ask Us</h2>
      <div style="max-width: 820px; margin: 28px auto 0">
        <FaqAccordion :items="homeFaq" />
      </div>
    </div>
  </section>

  <section class="section" style="padding: 18px 0">
    <div class="wrap">
      <img src="/assets/images/img-3.jpg" alt="Arden Roofing Roofing Replacement &amp; Repair" loading="lazy" style="width: 100%; border-radius: var(--radius)" />
    </div>
  </section>

  <CtaBand heading="Contact Us Today for a Free Estimate" text="Start with a conversation about what you are seeing. Call or request an estimate." />
</template>

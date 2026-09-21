<script setup>
import { RouterLink } from 'vue-router'
import { ROUTES } from '@/router/constants'
import { SITE } from '@/global/consts/site.consts'

const legalLinks = [
  { label: 'Privacy Policy', slug: 'privacy-policy' },
  { label: 'California Privacy Rights', slug: 'california-privacy' },
  { label: 'Terms & Conditions', slug: 'terms-conditions' },
  { label: 'Referral Marketing Disclosure', slug: 'referral-marketing-disclosure' },
  { label: 'Disclaimer', slug: 'disclaimer' },
  { label: 'Accessibility', slug: 'accessibility' },
  { label: 'Complaints Policy', slug: 'complaints-policy' },
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <h4>{{ SITE.name }}</h4>
          <p style="color: rgba(255, 255, 255, 0.8)">
            {{ SITE.name }} provides roof repair, installation, and replacement for homeowners across
            {{ SITE.addressLocality }}, Asheville, and surrounding Western North Carolina communities.
          </p>
          <p class="footer-disclaimer">
            This is a service-area business. We do not operate a staffed office in {{ SITE.addressLocality }}, {{ SITE.addressRegion }}.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><RouterLink :to="{ name: ROUTES.ABOUT }">About Us</RouterLink></li>
            <li><RouterLink :to="{ name: ROUTES.SERVICES_INDEX }">Our Services</RouterLink></li>
            <li><RouterLink :to="{ name: ROUTES.SERVICE_AREAS_INDEX }">Service Areas</RouterLink></li>
            <li><RouterLink :to="{ name: ROUTES.CONTACT }">Contact</RouterLink></li>
            <li><RouterLink :to="{ name: ROUTES.QUOTE }">Get a Free Quote</RouterLink></li>
            <li><RouterLink :to="{ name: ROUTES.FAQ }">FAQ</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Information</h4>
          <ul>
            <li v-for="link in legalLinks" :key="link.slug">
              <RouterLink :to="{ name: ROUTES.LEGAL, params: { legalSlug: link.slug } }">{{ link.label }}</RouterLink>
            </li>
            <li><RouterLink :to="{ name: ROUTES.TEAM }">Meet the Team</RouterLink></li>
            <li><RouterLink :to="{ name: ROUTES.CAREERS }">Careers</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p style="color: rgba(255, 255, 255, 0.8)">
            Call us at <a class="wc-phone" :href="SITE.phoneHref">{{ SITE.phoneDisplay }}</a><br />
            Email: <a :href="`mailto:${SITE.email}`">{{ SITE.email }}</a>
          </p>
          <p class="footer-disclaimer">
            {{ SITE.name }} serves residential roofing customers throughout the Asheville, North Carolina region.
          </p>
        </div>
      </div>
      <div class="footer-bottom">&copy; {{ year }} {{ SITE.name }}. All rights reserved.</div>
    </div>
  </footer>
</template>

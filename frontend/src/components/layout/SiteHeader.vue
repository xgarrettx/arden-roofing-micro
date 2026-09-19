<script setup>
// Nav structure (the 3 services, the top-level links) is site structure,
// not CMS content, so it's declared here rather than fetched — there's
// always exactly one services dropdown and it changes only when someone
// edits this component, unlike the location/service page bodies.
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/store/app.store'
import { ROUTES } from '@/router/constants'
import { SITE } from '@/global/consts/site.consts'
import { SERVICE_SUMMARIES } from '@/global/consts/services.consts'

const appStore = useAppStore()
</script>

<template>
  <header class="site-header">
    <nav class="nav">
      <RouterLink class="nav__logo" :to="{ name: ROUTES.HOME }" @click="appStore.closeMobileNav">
        <strong>{{ SITE.name }}</strong>
      </RouterLink>

      <button class="nav__toggle" aria-label="Menu" type="button" @click="appStore.toggleMobileNav">
        &#9776;
      </button>

      <ul class="nav__links" :class="{ open: appStore.mobileNavOpen }">
        <li class="has-dropdown">
          <RouterLink :to="{ name: ROUTES.SERVICES_INDEX }" @click="appStore.closeMobileNav">Our Services</RouterLink>
          <ul class="dropdown">
            <li v-for="service in SERVICE_SUMMARIES" :key="service.slug">
              <RouterLink
                :to="{ name: ROUTES.SERVICE_DETAIL, params: { serviceSlug: service.slug } }"
                @click="appStore.closeMobileNav"
              >
                {{ service.label }}
              </RouterLink>
            </li>
          </ul>
        </li>
        <li><RouterLink :to="{ name: ROUTES.SERVICE_AREAS_INDEX }" @click="appStore.closeMobileNav">Service Areas</RouterLink></li>
        <li><RouterLink :to="{ name: ROUTES.ABOUT }" @click="appStore.closeMobileNav">About Us</RouterLink></li>
        <li><RouterLink :to="{ name: ROUTES.CONTACT }" @click="appStore.closeMobileNav">Contact</RouterLink></li>
        <li><RouterLink :to="{ name: ROUTES.ESTIMATE }" @click="appStore.closeMobileNav">Get an Estimate</RouterLink></li>
        <li><a class="nav__call wc-phone" :href="SITE.phoneHref">{{ SITE.phoneDisplay }}</a></li>
      </ul>
    </nav>
  </header>
</template>

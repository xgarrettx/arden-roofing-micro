<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ROUTES } from '@/router/constants'
import { SITE } from '@/global/consts/site.consts'
import { useSeoMeta } from '@/composables/useSeoMeta'
import simpleIntros from '@/data/simple_intros.json'

const intro = simpleIntros.thank_you

useSeoMeta({
  title: intro.meta_title,
  description: intro.meta_description,
  path: computed(() => '/thank-you'),
})
</script>

<template>
  <section class="section">
    <div class="wrap article" style="text-align: center; margin-left: auto; margin-right: auto">
      <h1>{{ intro.h1 }}</h1>
      <div class="section__lead" style="margin: 18px auto 0">
        <p>We received your request. A member of the {{ SITE.name }} team will look it over and get back to you, usually within one business day.</p>
        <p>Need help sooner? Call us now and we will pick up or call straight back.</p>
      </div>
      <p style="margin-top: 24px">
        <a class="btn btn--lg wc-phone" :href="SITE.phoneHref">Call {{ SITE.phoneDisplay }}</a>
      </p>
      <p class="muted" style="margin-top: 20px">
        <RouterLink :to="{ name: ROUTES.HOME }">Back to the homepage</RouterLink>
        &middot;
        <RouterLink :to="{ name: ROUTES.SERVICES_INDEX }">See our services</RouterLink>
        &middot;
        <RouterLink :to="{ name: ROUTES.FAQ }">Read our FAQ</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ROUTES } from '@/router/constants'
import { SITE } from '@/global/consts/site.consts'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  intro: { type: String, default: '' },
  imageSrc: { type: String, default: '/assets/images/hero.jpg' },
  imageAlt: { type: String, required: true },
  ctaLabel: { type: String, default: 'Get a Free Estimate' },
})
</script>

<template>
  <section class="hero">
    <div class="hero__media">
      <img :src="imageSrc" :alt="imageAlt" />
    </div>
    <div class="hero__inner">
      <p v-if="eyebrow" class="hero__eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="intro">{{ intro }}</p>
      <div class="hero__cta">
        <RouterLink class="btn btn--lg" :to="{ name: ROUTES.ESTIMATE }">{{ ctaLabel }}</RouterLink>
        <a class="btn btn--ghost btn--lg wc-phone" :href="SITE.phoneHref" style="color: #fff; border-color: #fff">
          {{ SITE.phoneDisplay }}
        </a>
      </div>
    </div>
  </section>
</template>

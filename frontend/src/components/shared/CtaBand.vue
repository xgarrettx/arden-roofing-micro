<script setup>
import { SITE } from '@/global/consts/site.consts'

defineProps({
  heading: { type: String, required: true },
  text: { type: String, required: true },
})
</script>

<template>
  <section class="cta-band">
    <div class="wrap">
      <h2>{{ heading }}</h2>
      <p>{{ text }}</p>
      <p style="margin-top: 20px">
        <a class="btn btn--lg wc-phone" :href="SITE.phoneHref">Call {{ SITE.phoneDisplay }}</a>
      </p>
      <p class="muted" style="color: rgba(255, 255, 255, 0.8); margin-top: 10px">Free &mdash; no obligations</p>
    </div>
  </section>
</template>

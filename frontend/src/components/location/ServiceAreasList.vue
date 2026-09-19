<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ROUTES } from '@/router/constants'

const props = defineProps({
  locations: { type: Array, required: true }, // [{ slug, city_name }]
  excludeSlug: { type: String, default: '' },
})

const visible = computed(() => props.locations.filter((l) => l.slug !== props.excludeSlug))
</script>

<template>
  <ul class="linklist">
    <li v-for="location in visible" :key="location.slug">
      <RouterLink :to="{ name: ROUTES.LOCATION_DETAIL, params: { citySlug: location.slug } }">
        {{ location.city_name }}
      </RouterLink>
    </li>
  </ul>
</template>

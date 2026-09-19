<script setup>
defineProps({
  items: { type: Array, required: true }, // [{ title, text }]
  columns: { type: Number, default: 2 },
})
</script>

<template>
  <div class="grid" :class="`grid--${columns}`">
    <div v-for="item in items" :key="item.title" class="card">
      <h3>{{ item.title }}</h3>
      <p>{{ item.text }}</p>
    </div>
  </div>
</template>

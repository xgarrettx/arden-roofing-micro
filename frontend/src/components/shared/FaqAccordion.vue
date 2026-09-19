<script setup>
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { useInternalLinkClick } from '@/composables/useInternalLinks'

defineProps({
  items: { type: Array, required: true }, // [{ question, answer_html }]
})

const onClick = useInternalLinkClick()
</script>

<template>
  <Accordion class="faq">
    <AccordionTab v-for="item in items" :key="item.question" :header="item.question">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="item.answer_html" @click="onClick" />
    </AccordionTab>
  </Accordion>
</template>

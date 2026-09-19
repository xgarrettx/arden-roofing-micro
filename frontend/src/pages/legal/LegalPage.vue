<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ArticleContent from '@/components/shared/ArticleContent.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import articles from '@/data/articles.json'

const route = useRoute()

const article = computed(() => articles.find((a) => a.slug === route.params.legalSlug) || articles[0])

useSeoMeta({
  title: computed(() => article.value.meta_title),
  description: computed(() => article.value.meta_description),
  path: computed(() => article.value.route),
})
</script>

<template>
  <ArticleContent
    v-if="article"
    :title="article.h1"
    :intro-html="article.intro_html"
    :last-updated="article.last_updated"
    :body-html="article.body_html"
  />
</template>

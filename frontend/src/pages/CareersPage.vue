<script setup>
import { computed } from 'vue'
import ArticleContent from '@/components/shared/ArticleContent.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import articles from '@/data/articles.json'

const article = articles.find((a) => a.slug === 'careers')

useSeoMeta({
  title: article.meta_title,
  description: article.meta_description,
  path: computed(() => '/careers'),
})
</script>

<template>
  <ArticleContent :title="article.h1" :intro-html="article.intro_html" :body-html="article.body_html" />
</template>

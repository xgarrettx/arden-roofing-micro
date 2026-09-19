<script setup>
import { computed } from 'vue'
import ArticleContent from '@/components/shared/ArticleContent.vue'
import CtaBand from '@/components/shared/CtaBand.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import articles from '@/data/articles.json'

const article = articles.find((a) => a.slug === 'about')

useSeoMeta({
  title: article.meta_title,
  description: article.meta_description,
  path: computed(() => '/about'),
})
</script>

<template>
  <ArticleContent :title="article.h1" :intro-html="article.intro_html" :body-html="article.body_html" />
  <CtaBand
    heading="Ready to Talk About Your Project?"
    text="Start with a conversation about what you are seeing. Call or request an estimate."
  />
</template>

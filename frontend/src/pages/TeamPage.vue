<script setup>
import { computed } from 'vue'
import { useRequest } from 'vue-request'
import CtaBand from '@/components/shared/CtaBand.vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { useInternalLinkClick } from '@/composables/useInternalLinks'
import { TeamService } from '@/services/content/team.service'
import simpleIntros from '@/data/simple_intros.json'
import teamOutro from '@/data/team_outro.json'

const { data: teamRes, runAsync: loadTeam } = useRequest(TeamService.getAll, { manual: true })
await loadTeam()
const members = computed(() => (Array.isArray(teamRes.value?.data) ? teamRes.value.data : []))

const intro = simpleIntros.team

useSeoMeta({
  title: intro.meta_title,
  description: intro.meta_description,
  path: computed(() => '/team'),
})

const onClick = useInternalLinkClick()
</script>

<template>
  <section class="section">
    <div class="wrap article">
      <h1>{{ intro.h1 }}</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="intro.intro_html" />

      <h2>The People You Will Work With</h2>
      <div class="grid grid--3 team-grid">
        <div v-for="member in members" :key="member.name" class="card team-card">
          <div aria-hidden="true" class="avatar">{{ member.initials }}</div>
          <h3>{{ member.name }}</h3>
          <div class="role">{{ member.role }}</div>
          <p>{{ member.bio }}</p>
        </div>
      </div>

      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="teamOutro.outro_html" @click="onClick" />
    </div>
  </section>
  <CtaBand
    heading="Talk With Us About Your Project"
    text="Start with a conversation about what you are seeing. Call or request an estimate."
  />
</template>

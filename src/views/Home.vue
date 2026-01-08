<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useTheme } from 'vuetify'
import projectsData from '../data/projects.json'

const { t, locale } = useI18n()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

// Get featured projects (those with awards)
const featuredProjects = computed(() => {
  return projectsData.projects
    .filter(p => p.awards && p.awards.length > 0)
    .slice(0, 4)
})

const getLocalizedText = (obj) => {
  if (typeof obj === 'string') return obj
  return obj[locale.value] || obj['es']
}

const getImageUrl = (path) => {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <v-container fluid :class="['hero-section', 'pa-0', isDark ? 'hero-dark' : 'hero-light']">
      <div class="hero-overlay">
        <v-container class="py-16">
          <v-row align="center" justify="center" class="min-height-hero">
            <v-col cols="12" md="6" class="text-center text-md-left">
              <h1 class="text-h2 text-md-h1 font-weight-bold mb-4 text-primary">
                FELO VALENCIA
              </h1>
              <h2 class="text-h4 text-md-h3 font-weight-light mb-6">
                {{ t('home.title') }}
              </h2>
              <p class="text-h6 text-medium-emphasis mb-8" style="max-width: 600px;">
                {{ t('home.subtitle') }}
              </p>
              <v-btn
                size="x-large"
                color="primary"
                to="/portfolio"
                class="mr-4"
              >
                {{ t('home.viewPortfolio') }}
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" class="d-none d-md-flex justify-center">
              <div class="hero-image-container">
                <v-icon size="200" color="primary" class="hero-icon">mdi-waveform</v-icon>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <!-- Bio Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card class="pa-8 bg-surface-variant" variant="flat">
            <p class="text-body-1 text-medium-emphasis" style="line-height: 1.8;">
              {{ t('home.bio') }}
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Work Section -->
    <v-container class="py-16">
      <h2 class="text-h4 font-weight-bold mb-8 text-center">
        {{ t('home.featuredWork') }}
      </h2>
      <v-row>
        <v-col
          v-for="project in featuredProjects"
          :key="project.id"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-card class="project-card h-100" variant="flat" color="surface-variant">
            <v-img
              :src="getImageUrl(project.image)"
              height="200"
              cover
              class="project-image"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="primary" />
                </v-row>
              </template>
            </v-img>
            <v-card-text class="pa-4">
              <h3 class="text-h6 mb-2 text-high-emphasis">{{ project.title }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-2">{{ project.year }}</p>
              <v-chip
                v-for="(award, index) in project.awards.slice(0, 1)"
                :key="index"
                size="small"
                color="secondary"
                class="mr-1 mb-1"
              >
                <v-icon start size="small">mdi-trophy</v-icon>
                {{ award.substring(0, 30) }}{{ award.length > 30 ? '...' : '' }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div class="text-center mt-8">
        <v-btn size="large" variant="outlined" color="primary" to="/portfolio">
          {{ t('portfolio.allProjects') }}
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.hero-section {
  min-height: 80vh;
}

.hero-dark {
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
}

.hero-light {
  background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%);
}

.hero-overlay {
  background: radial-gradient(ellipse at center, rgba(0, 188, 212, 0.1) 0%, transparent 70%);
  min-height: 80vh;
}

.min-height-hero {
  min-height: 60vh;
}

.hero-image-container {
  position: relative;
}

.hero-icon {
  opacity: 0.3;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.5; }
}

.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 188, 212, 0.2);
}

.project-image {
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}
</style>

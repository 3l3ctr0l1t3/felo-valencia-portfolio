<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import projectsData from '../data/projects.json'

const { t, locale } = useI18n()

const selectedCategory = ref('all')
const selectedProject = ref(null)
const dialogOpen = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20

const categories = [
  { value: 'all', label: 'portfolio.allProjects' },
  { value: 'film', label: 'portfolio.films' },
  { value: 'series', label: 'portfolio.series' },
  { value: 'documentary', label: 'portfolio.documentaries' }
]

// Category priority for sorting (lower = higher priority)
const categoryPriority = {
  'film': 1,
  'series': 2,
  'documentary': 3
}

const sortedProjects = computed(() => {
  return [...projectsData.projects].sort((a, b) => {
    // First sort by year (newest first)
    if (b.year !== a.year) {
      return b.year - a.year
    }
    // Then by category priority (films first, then series, etc.)
    const priorityA = categoryPriority[a.category] || 99
    const priorityB = categoryPriority[b.category] || 99
    if (priorityA !== priorityB) {
      return priorityA - priorityB
    }
    // Finally alphabetically by title
    return a.title.localeCompare(b.title)
  })
})

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return sortedProjects.value
  }
  return sortedProjects.value.filter(p => p.category === selectedCategory.value)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProjects.value.length / itemsPerPage)
})

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProjects.value.slice(start, end)
})

// Reset to page 1 when category changes
watch(selectedCategory, () => {
  currentPage.value = 1
})

const getLocalizedText = (obj) => {
  if (typeof obj === 'string') return obj
  return obj[locale.value] || obj['es']
}

const openProject = (project) => {
  selectedProject.value = project
  dialogOpen.value = true
}
</script>

<template>
  <div>
    <!-- Header Section -->
    <v-container class="py-12">
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1 class="text-h3 font-weight-bold mb-4">{{ t('portfolio.title') }}</h1>
          <p class="text-h6 text-grey-lighten-1">{{ t('portfolio.subtitle') }}</p>
        </v-col>
      </v-row>

      <!-- Filter Chips -->
      <v-row justify="center" class="mt-6">
        <v-col cols="12" class="text-center">
          <v-chip-group v-model="selectedCategory" mandatory selected-class="text-primary">
            <v-chip
              v-for="cat in categories"
              :key="cat.value"
              :value="cat.value"
              filter
              variant="outlined"
              class="mx-1"
            >
              {{ t(cat.label) }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-container>

    <!-- Projects Grid -->
    <v-container class="pb-16">
      <v-row>
        <v-col
          v-for="project in paginatedProjects"
          :key="project.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="project-card h-100"
            variant="flat"
            color="surface-variant"
            @click="openProject(project)"
          >
            <div class="project-image-wrapper">
              <v-img
                :src="project.image"
                :aspect-ratio="2/3"
                cover
                class="project-image"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary" />
                  </v-row>
                </template>
                <template v-slot:error>
                  <v-row class="fill-height ma-0 bg-grey-darken-3" align="center" justify="center">
                    <v-icon size="64" color="grey">mdi-movie-open-outline</v-icon>
                  </v-row>
                </template>
                <div class="project-overlay">
                  <v-icon size="large" color="white">mdi-play-circle-outline</v-icon>
                </div>
              </v-img>
            </div>
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <h3 class="text-subtitle-1 font-weight-bold text-white">{{ project.title }}</h3>
                <span class="text-body-2 text-grey">{{ project.year }}</span>
              </div>
              <p class="text-body-2 text-grey-lighten-1 mb-2">
                {{ getLocalizedText(project.role) }}
              </p>
              <div v-if="project.awards && project.awards.length > 0">
                <v-icon size="small" color="secondary" class="mr-1">mdi-trophy</v-icon>
                <span class="text-caption text-secondary">
                  {{ project.awards[0].length > 35 ? project.awards[0].substring(0, 35) + '...' : project.awards[0] }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Pagination -->
      <v-row v-if="totalPages > 1" justify="center" class="mt-8">
        <v-col cols="12" class="d-flex flex-column align-center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            color="primary"
            rounded="circle"
          />
          <p class="text-body-2 text-grey mt-2">
            {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredProjects.length) }}
            {{ t('portfolio.of') }} {{ filteredProjects.length }} {{ t('portfolio.projects') }}
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Project Detail Dialog -->
    <v-dialog v-model="dialogOpen" max-width="900">
      <v-card v-if="selectedProject" class="bg-surface dialog-card">
        <v-btn
          icon
          variant="text"
          size="small"
          class="dialog-close-btn"
          @click="dialogOpen = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-row no-gutters>
          <!-- Poster Column -->
          <v-col cols="12" md="5" class="dialog-poster-col">
            <div class="dialog-poster-wrapper">
              <v-img
                :src="selectedProject.image"
                :aspect-ratio="2/3"
                cover
                class="dialog-poster"
              >
                <template v-slot:error>
                  <v-row class="fill-height ma-0 bg-grey-darken-3" align="center" justify="center">
                    <v-icon size="80" color="grey">mdi-movie-open-outline</v-icon>
                  </v-row>
                </template>
              </v-img>
            </div>
          </v-col>
          <!-- Content Column -->
          <v-col cols="12" md="7" class="d-flex flex-column">
            <v-card-title class="text-h5 pt-6 pb-1">
              {{ selectedProject.title }}
            </v-card-title>
            <v-card-subtitle class="pb-0">
              {{ selectedProject.year }} · {{ getLocalizedText(selectedProject.role) }}
            </v-card-subtitle>
            <v-card-text class="pt-4 flex-grow-1 dialog-content">
              <p class="text-body-1 mb-4">
                {{ getLocalizedText(selectedProject.description) }}
              </p>

              <div v-if="selectedProject.director" class="mb-3">
                <strong>{{ t('project.director') }}:</strong> {{ selectedProject.director }}
              </div>

              <div v-if="selectedProject.awards && selectedProject.awards.length > 0" class="mt-4">
                <h4 class="text-subtitle-1 font-weight-bold mb-2">
                  <v-icon color="secondary" class="mr-1">mdi-trophy</v-icon>
                  {{ t('project.awards') }}
                </h4>
                <v-chip
                  v-for="(award, index) in selectedProject.awards"
                  :key="index"
                  class="mr-2 mb-2"
                  color="secondary"
                  variant="tonal"
                  size="small"
                >
                  {{ award }}
                </v-chip>
              </div>
            </v-card-text>
            <v-card-actions class="pa-4 pt-0">
              <v-btn
                v-if="selectedProject.imdb"
                color="warning"
                variant="tonal"
                :href="selectedProject.imdb"
                target="_blank"
                prepend-icon="mdi-movie-open"
              >
                IMDB
              </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.project-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 188, 212, 0.2);
}

.project-image-wrapper {
  overflow: hidden;
  background-color: #1a1a1a;
}

.project-image {
  transition: transform 0.3s ease;
}

.project-image :deep(.v-img__img) {
  object-position: top center;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.dialog-card {
  position: relative;
  overflow: hidden;
}

.dialog-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.dialog-poster-col {
  background-color: #1a1a1a;
}

.dialog-poster-wrapper {
  height: 100%;
  min-height: 300px;
}

.dialog-poster {
  height: 100%;
}

.dialog-content {
  max-height: 350px;
  overflow-y: auto;
}

@media (min-width: 960px) {
  .dialog-poster-wrapper {
    min-height: 450px;
  }
}

@media (max-width: 959px) {
  .dialog-poster-wrapper {
    max-height: 400px;
  }
}
</style>

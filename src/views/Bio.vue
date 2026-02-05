<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

const { t } = useI18n()
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)

const getImageUrl = (path) => {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
</script>

<template>
  <div>
    <!-- Bio Content -->
    <v-container fluid :class="['bio-section', 'pa-0', isDark ? 'bio-dark' : 'bio-light']">
      <div class="bio-overlay">
    <v-container class="py-16">
      <v-row justify="center">
        <v-col cols="12" md="4" class="d-flex justify-center">
          <v-img
            :src="getImageUrl('images/HD-2.jpg')"
            max-width="350"
            aspect-ratio="2/3"
            class="rounded-lg elevation-6"
            cover
          />
        </v-col>
        <v-col cols="12" md="6">
          <h2 class="text-h4 font-weight-bold mb-6">{{ t('bio.aboutTitle') }}</h2>
          <p class="text-body-1 text-medium-emphasis mb-6" style="line-height: 1.8;">
            {{ t('bio.paragraph1') }}
          </p>
          <p class="text-body-1 text-medium-emphasis mb-6" style="line-height: 1.8;">
            {{ t('bio.paragraph2') }}
          </p>
          <p class="text-body-1 text-medium-emphasis" style="line-height: 1.8;">
            {{ t('bio.paragraph3') }}
          </p>
        </v-col>
      </v-row>
    </v-container>
      </div>
    </v-container>

    <!-- Skills / Experience -->
    <v-container class="py-12 pb-16">
      <h2 class="text-h4 font-weight-bold mb-8 text-center">{{ t('bio.skillsTitle') }}</h2>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="3" v-for="(skill, i) in ['soundDesign', 'mixing', 'foley', 'adr']" :key="i">
          <v-card class="pa-6 text-center h-100" variant="flat" color="surface-variant">
            <v-icon size="48" color="primary" class="mb-4">
              {{ { soundDesign: 'mdi-surround-sound', mixing: 'mdi-tune-vertical', foley: 'mdi-shoe-print', adr: 'mdi-microphone' }[skill] }}
            </v-icon>
            <h3 class="text-h6 mb-2">{{ t('bio.skills.' + skill + '.title') }}</h3>
            <p class="text-body-2 text-medium-emphasis">{{ t('bio.skills.' + skill + '.desc') }}</p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.bio-dark {
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
}

.bio-light {
  background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 50%, #e8e8e8 100%);
}

.bio-overlay {
  background: radial-gradient(ellipse at center, rgba(0, 188, 212, 0.1) 0%, transparent 70%);
}
</style>

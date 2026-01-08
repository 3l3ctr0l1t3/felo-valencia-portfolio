<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const { locale, t } = useI18n()
const theme = useTheme()
const drawer = ref(false)

const isDark = computed(() => theme.global.current.value.dark)

const toggleTheme = () => {
  const newTheme = isDark.value ? 'lightTheme' : 'darkTheme'
  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
}

const changeLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

const navItems = [
  { title: 'nav.home', to: '/' },
  { title: 'nav.portfolio', to: '/portfolio' }
]
</script>

<template>
  <v-app>
    <v-app-bar flat color="transparent" class="px-4">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <router-link to="/" class="text-decoration-none">
        <img src="/images/logo.png" alt="Felo Valencia" class="header-logo" />
      </router-link>
      <v-spacer />
      <div class="d-none d-md-flex align-center">
        <v-btn v-for="item in navItems" :key="item.to" :to="item.to" variant="text" class="mx-1">
          {{ t(item.title) }}
        </v-btn>
        <v-divider vertical class="mx-3" />
        <v-btn icon variant="text" @click="toggleTheme" class="mr-2">
          <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
        <v-btn-toggle v-model="locale" mandatory density="compact" color="primary">
          <v-btn value="es" size="small" @click="changeLanguage('es')">ES</v-btn>
          <v-btn value="en" size="small" @click="changeLanguage('en')">EN</v-btn>
        </v-btn-toggle>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item v-for="item in navItems" :key="item.to" :to="item.to" @click="drawer = false">
          <v-list-item-title>{{ t(item.title) }}</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item @click="toggleTheme">
          <template v-slot:prepend>
            <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </template>
          <v-list-item-title>{{ isDark ? 'Light Mode' : 'Dark Mode' }}</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item>
          <v-btn-toggle v-model="locale" mandatory density="compact" color="primary">
            <v-btn value="es" size="small" @click="changeLanguage('es')">ES</v-btn>
            <v-btn value="en" size="small" @click="changeLanguage('en')">EN</v-btn>
          </v-btn-toggle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="bg-surface pa-6">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <img src="/images/logo.png" alt="Felo Valencia" class="footer-logo mb-2" />
          </v-col>
          <v-col cols="12" md="4">
            <h4 class="text-subtitle-1 mb-2">{{ t('contact.title') }}</h4>
            <p class="text-body-2 text-medium-emphasis">info@felovalencia.com</p>
          </v-col>
          <v-col cols="12" md="4">
            <h4 class="text-subtitle-1 mb-2">{{ t('contact.connect') }}</h4>
            <div class="d-flex ga-2">
              <v-btn icon size="small" variant="text" href="https://www.linkedin.com/in/felipe-v-129a0596/" target="_blank">
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
              <v-btn icon size="small" variant="text" href="https://www.instagram.com/felovalencip" target="_blank">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <p class="text-center text-body-2 text-medium-emphasis">
          © {{ new Date().getFullYear() }} Felo Valencia. {{ t('footer.rights') }}.
        </p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.header-logo {
  height: 36px;
  width: auto;
}

.footer-logo {
  height: 50px;
  width: auto;
}
</style>

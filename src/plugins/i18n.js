import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'

// Get browser language or default to Spanish
const getBrowserLocale = () => {
  const navigatorLocale = navigator.language || navigator.userLanguage
  if (navigatorLocale) {
    return navigatorLocale.split('-')[0]
  }
  return 'es'
}

// Check localStorage for saved preference
const getSavedLocale = () => {
  return localStorage.getItem('locale') || getBrowserLocale()
}

export default createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'es',
  messages: {
    en,
    es
  }
})

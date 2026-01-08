import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const darkTheme = {
  dark: true,
  colors: {
    background: '#0a0a0f',
    surface: '#12121a',
    'surface-variant': '#1a1a25',
    primary: '#00bcd4',
    secondary: '#e91e63',
    accent: '#00bcd4',
    error: '#f44336',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  }
}

const lightTheme = {
  dark: false,
  colors: {
    background: '#f5f5f5',
    surface: '#ffffff',
    'surface-variant': '#e8e8e8',
    primary: '#0097a7',
    secondary: '#c2185b',
    accent: '#0097a7',
    error: '#d32f2f',
    info: '#1976D2',
    success: '#388E3C',
    warning: '#F57C00',
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: localStorage.getItem('theme') || 'darkTheme',
    themes: {
      darkTheme,
      lightTheme
    }
  },
  defaults: {
    VCard: {
      elevation: 0,
    },
    VBtn: {
      variant: 'flat',
    }
  }
})

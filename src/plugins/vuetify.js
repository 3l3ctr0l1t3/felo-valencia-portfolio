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

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme
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

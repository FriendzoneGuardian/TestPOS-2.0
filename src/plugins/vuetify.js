import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const forestGreenTheme = {
  dark: false,
  colors: {
    primary: '#228B22',
    'primary-darken-1': '#1A6B1A',
    secondary: '#4CAF50',
    'secondary-darken-1': '#388E3C',
    accent: '#8BC34A',
    error: '#B71C1C',
    info: '#1B5E20',
    success: '#2E7D32',
    warning: '#F9A825',
    background: '#F1F8E9',
    surface: '#FFFFFF',
    'on-background': '#1B5E20',
    'on-surface': '#1B5E20',
  }
}

const duskTheme = {
  dark: true,
  colors: {
    primary: '#4CAF50',
    'primary-darken-1': '#388E3C',
    secondary: '#81C784',
    'secondary-darken-1': '#66BB6A',
    accent: '#A5D6A7',
    error: '#EF5350',
    info: '#A5D6A7',
    success: '#66BB6A',
    warning: '#FFD54F',
    background: '#1B2B1B',
    surface: '#243324',
    'on-background': '#C8E6C9',
    'on-surface': '#C8E6C9',
  }
}

const amoledTheme = {
  dark: true,
  colors: {
    primary: '#4CAF50',
    'primary-darken-1': '#388E3C',
    secondary: '#81C784',
    'secondary-darken-1': '#66BB6A',
    accent: '#A5D6A7',
    error: '#EF5350',
    info: '#A5D6A7',
    success: '#66BB6A',
    warning: '#FFD54F',
    background: '#000000',
    surface: '#0D1A0D',
    'on-background': '#C8E6C9',
    'on-surface': '#C8E6C9',
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dawn',
    themes: {
      dawn: forestGreenTheme,
      dusk: duskTheme,
      amoled: amoledTheme,
    }
  },
  icons: {
    defaultSet: 'mdi',
  }
})

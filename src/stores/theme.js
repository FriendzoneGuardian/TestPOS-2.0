import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const THEMES = ['dawn', 'dusk', 'amoled']
  const currentTheme = ref(localStorage.getItem('pos_theme') || 'dawn')

  function setTheme(theme) {
    if (THEMES.includes(theme)) {
      currentTheme.value = theme
      localStorage.setItem('pos_theme', theme)
    }
  }

  function cycleTheme() {
    const idx = THEMES.indexOf(currentTheme.value)
    setTheme(THEMES[(idx + 1) % THEMES.length])
  }

  return { currentTheme, THEMES, setTheme, cycleTheme }
})

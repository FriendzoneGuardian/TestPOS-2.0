<template>
  <v-app :theme="themeStore.currentTheme">
    <router-view />
    <InactivityWatcher v-if="authStore.isAuthenticated" />
  </v-app>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import InactivityWatcher from '@/components/common/InactivityWatcher.vue'

const themeStore = useThemeStore()
const authStore = useAuthStore()
</script>

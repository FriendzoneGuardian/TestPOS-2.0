<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent color="surface">
    <v-list-item
      prepend-icon="mdi-sprout"
      title="TestPOS 2.0"
      nav
    >
      <template #append>
        <v-btn
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          variant="text"
          @click="rail = !rail"
        />
      </template>
    </v-list-item>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        active-color="primary"
        rounded="lg"
      />
    </v-list>

    <template #append>
      <v-divider />
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="handleLogout"
          rounded="lg"
        />
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar color="primary" elevation="2">
    <v-app-bar-title>
      <span class="font-weight-bold">{{ currentPageTitle }}</span>
    </v-app-bar-title>

    <template #append>
      <v-chip
        v-if="inactivityRemaining <= 30"
        color="error"
        variant="tonal"
        prepend-icon="mdi-timer-alert"
        class="mr-2"
      >
        Lock in {{ inactivityRemaining }}s
      </v-chip>

      <v-btn
        :icon="themeIcon"
        variant="text"
        @click="themeStore.cycleTheme()"
        :title="`Theme: ${themeStore.currentTheme}`"
      />

      <v-avatar color="secondary" size="36" class="mr-2 ml-1" style="cursor:pointer">
        <span class="text-caption font-weight-bold">{{ authStore.userAvatar }}</span>
      </v-avatar>
    </template>
  </v-app-bar>

  <v-main>
    <v-container fluid class="pa-4">
      <router-view />
    </v-container>
  </v-main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useInactivity } from '@/composables/useInactivity'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const drawer = ref(true)
const rail = ref(false)

const { remaining: inactivityRemaining } = useInactivity(180000, () => {
  authStore.logout()
  router.push({ name: 'Login', query: { reason: 'inactivity' } })
})

const ALL_NAV = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard', roles: ['admin', 'accounting', 'cashier'] },
  { title: 'Terminal', icon: 'mdi-point-of-sale', to: '/terminal', roles: ['admin', 'cashier'] },
  { title: 'Reports', icon: 'mdi-chart-bar', to: '/reports', roles: ['admin', 'accounting'] },
  { title: 'Users', icon: 'mdi-account-group', to: '/users', roles: ['admin'] },
]

const navItems = computed(() => ALL_NAV.filter(i => i.roles.includes(authStore.userRole)))

const currentPageTitle = computed(() => {
  const match = ALL_NAV.find(i => i.to === route.path)
  return match ? match.title : 'TestPOS 2.0'
})

const themeIcon = computed(() => {
  return { dawn: 'mdi-weather-sunny', dusk: 'mdi-weather-night', amoled: 'mdi-circle' }[themeStore.currentTheme] || 'mdi-theme-light-dark'
})

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

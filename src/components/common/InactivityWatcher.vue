<template>
  <v-dialog v-model="showWarning" max-width="400" persistent>
    <v-card>
      <v-card-title class="text-h6 d-flex align-center ga-2">
        <v-icon color="warning">mdi-timer-alert</v-icon>
        Session Timeout Warning
      </v-card-title>
      <v-card-text>
        You will be logged out due to inactivity in
        <strong class="text-error">{{ remaining }}s</strong>.
        Move your mouse or press any key to stay logged in.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="elevated" @click="dismiss">Stay Logged In</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useInactivity } from '@/composables/useInactivity'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const { remaining, resetTimer } = useInactivity(180000, () => {
  authStore.logout()
  router.push({ name: 'Login', query: { reason: 'inactivity' } })
})

const showWarning = computed(() => remaining.value <= 30 && remaining.value > 0)

function dismiss() {
  resetTimer()
}
</script>

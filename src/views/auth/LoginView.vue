<template>
  <v-app :theme="themeStore.currentTheme">
    <v-main style="background: linear-gradient(135deg, #1B5E20 0%, #388E3C 50%, #66BB6A 100%);">
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center" class="fill-height">
          <v-col cols="12" sm="8" md="5" lg="4">
            <!-- Theme toggle -->
            <div class="d-flex justify-end mb-2">
              <v-btn
                :icon="themeIcon"
                variant="tonal"
                color="white"
                density="comfortable"
                @click="themeStore.cycleTheme()"
                :title="`Switch theme (current: ${themeStore.currentTheme})`"
              />
            </div>

            <v-card rounded="xl" elevation="8">
              <v-card-text class="pa-8">
                <!-- Logo -->
                <div class="text-center mb-6">
                  <v-icon size="64" color="primary">mdi-sprout</v-icon>
                  <div class="text-h5 font-weight-bold text-primary mt-2">TestPOS 2.0</div>
                  <div class="text-caption text-medium-emphasis">Farm Point of Sales System</div>
                </div>

                <!-- Inactivity notice -->
                <v-alert
                  v-if="route.query.reason === 'inactivity'"
                  type="warning"
                  variant="tonal"
                  class="mb-4"
                  density="compact"
                  closable
                >
                  You were logged out due to 3 minutes of inactivity.
                </v-alert>

                <!-- Error alert -->
                <v-alert
                  v-if="errorMsg"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  density="compact"
                  closable
                  @click:close="errorMsg = ''"
                >
                  {{ errorMsg }}
                </v-alert>

                <v-form @submit.prevent="handleLogin" ref="formRef">
                  <v-text-field
                    v-model="username"
                    label="Username"
                    prepend-inner-icon="mdi-account"
                    variant="outlined"
                    class="mb-3"
                    :rules="[v => !!v || 'Username is required']"
                    autocomplete="username"
                  />
                  <v-text-field
                    v-model="password"
                    label="Password"
                    prepend-inner-icon="mdi-lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    variant="outlined"
                    class="mb-4"
                    :rules="[v => !!v || 'Password is required']"
                    autocomplete="current-password"
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    size="large"
                    block
                    :loading="loading"
                    rounded="lg"
                  >
                    <v-icon start>mdi-login</v-icon>
                    Sign In
                  </v-btn>
                </v-form>

                <!-- Demo hints -->
                <v-expansion-panels class="mt-4" variant="accordion">
                  <v-expansion-panel title="Demo Credentials">
                    <v-expansion-panel-text>
                      <v-table density="compact">
                        <tbody>
                          <tr v-for="c in demoCreds" :key="c.role" @click="fillCreds(c)" style="cursor:pointer">
                            <td><v-chip :color="roleColor(c.role)" size="small" variant="tonal">{{ c.role }}</v-chip></td>
                            <td>{{ c.username }}</td>
                            <td>{{ c.password }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                      <div class="text-caption text-medium-emphasis mt-1">Click a row to auto-fill</div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>

            <div class="text-center mt-4 text-white text-caption opacity-80">
              &copy; {{ new Date().getFullYear() }} FarmsCore Inc. — TestPOS 2.0
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const formRef = ref(null)

const demoCreds = [
  { role: 'admin', username: 'admin', password: 'admin123' },
  { role: 'accounting', username: 'accounting', password: 'acc123' },
  { role: 'cashier', username: 'cashier', password: 'cash123' },
]

const themeIcon = computed(() => {
  return { dawn: 'mdi-weather-sunny', dusk: 'mdi-weather-night', amoled: 'mdi-circle' }[themeStore.currentTheme] || 'mdi-theme-light-dark'
})

function roleColor(role) {
  return { admin: 'error', accounting: 'info', cashier: 'success' }[role] || 'primary'
}

function fillCreds(c) {
  username.value = c.username
  password.value = c.password
}

async function handleLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  loading.value = true
  errorMsg.value = ''
  try {
    await new Promise(r => setTimeout(r, 600))
    authStore.login(username.value, password.value)
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (e) {
    errorMsg.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

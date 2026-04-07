<template>
  <div>
    <div class="text-h5 font-weight-bold mb-1">Dashboard</div>
    <div class="text-caption text-medium-emphasis mb-4">{{ currentDate }}</div>

    <!-- Welcome Banner -->
    <v-card color="primary" rounded="xl" class="mb-4" elevation="2">
      <v-card-text class="pa-5">
        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <div>
            <div class="text-h6 font-weight-bold text-white">Welcome back, {{ authStore.userName }}!</div>
            <v-chip :color="roleChipColor" variant="tonal" size="small" class="mt-1">
              <v-icon start size="small">{{ roleIcon }}</v-icon>
              {{ roleLabel }}
            </v-chip>
          </div>
          <v-icon size="56" class="text-white opacity-60">mdi-sprout</v-icon>
        </div>
      </v-card-text>
    </v-card>

    <!-- Stats Cards -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3" v-for="stat in stats" :key="stat.title">
        <v-card rounded="xl" elevation="1" height="120">
          <v-card-text class="d-flex flex-column justify-space-between h-100 pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="text-caption text-medium-emphasis">{{ stat.title }}</div>
              <v-icon :color="stat.color" size="22">{{ stat.icon }}</v-icon>
            </div>
            <div>
              <div class="text-h5 font-weight-bold">{{ stat.value }}</div>
              <div class="text-caption" :class="`text-${stat.color}`">{{ stat.sub }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">Quick Actions</v-card-title>
          <v-card-text class="pt-0">
            <div class="d-flex flex-wrap ga-2">
              <v-btn
                v-for="action in quickActions"
                :key="action.label"
                :to="action.to"
                :color="action.color"
                :prepend-icon="action.icon"
                variant="tonal"
                rounded="lg"
              >{{ action.label }}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="xl" elevation="1">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">Session Info</v-card-title>
          <v-card-text class="pt-0">
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-account" :title="authStore.userName" subtitle="Logged-in User" />
              <v-list-item prepend-icon="mdi-shield-account" :title="roleLabel" subtitle="Role" />
              <v-list-item prepend-icon="mdi-clock-outline" :title="currentTime" subtitle="Current Time" />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Transactions -->
    <v-card rounded="xl" elevation="1">
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2 d-flex align-center justify-space-between">
        <span>Recent Transactions</span>
        <v-chip size="small" color="primary" variant="tonal">Today</v-chip>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-data-table
          v-if="recentTxns.length"
          :headers="txnHeaders"
          :items="recentTxns"
          density="compact"
          :items-per-page="5"
          item-value="id"
        >
          <template #item.total="{ item }">
            <strong>&#8369;{{ item.total.toFixed(2) }}</strong>
          </template>
          <template #item.status="{ item }">
            <v-chip color="success" size="x-small" variant="tonal">{{ item.status }}</v-chip>
          </template>
          <template #item.date="{ item }">
            {{ new Date(item.date).toLocaleTimeString() }}
          </template>
        </v-data-table>
        <v-empty-state
          v-else
          icon="mdi-receipt-text-outline"
          title="No transactions today"
          text="Transactions processed at the terminal will appear here."
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePosStore } from '@/stores/pos'

const authStore = useAuthStore()
const posStore = usePosStore()

const currentTime = ref(new Date().toLocaleTimeString())
const currentDate = computed(() => new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))

setInterval(() => { currentTime.value = new Date().toLocaleTimeString() }, 1000)

const roleLabel = computed(() => ({ admin: 'Administrator', accounting: 'Accounting', cashier: 'Cashier' }[authStore.userRole] || authStore.userRole))
const roleChipColor = computed(() => ({ admin: 'error', accounting: 'info', cashier: 'success' }[authStore.userRole] || 'primary'))
const roleIcon = computed(() => ({ admin: 'mdi-shield-crown', accounting: 'mdi-calculator', cashier: 'mdi-point-of-sale' }[authStore.userRole] || 'mdi-account'))

const todayTxns = computed(() => posStore.getTodaysTransactions())
const todaySales = computed(() => posStore.getTodaysSales())

const stats = computed(() => {
  const map = {}
  todayTxns.value.forEach(t => t.items.forEach(i => { map[i.name] = (map[i.name] || 0) + i.qty }))
  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1])
  const topProduct = sorted.length ? sorted[0][0] : 'N/A'
  return [
    { title: "Today's Sales", value: `\u20B1${todaySales.value.toFixed(2)}`, icon: 'mdi-cash', color: 'success', sub: 'Gross Revenue' },
    { title: 'Transactions', value: todayTxns.value.length, icon: 'mdi-receipt', color: 'primary', sub: 'Today' },
    { title: 'Top Product', value: topProduct, icon: 'mdi-star', color: 'warning', sub: 'By quantity' },
    { title: 'Cart Items', value: posStore.cartCount, icon: 'mdi-cart', color: 'info', sub: 'In current cart' },
  ]
})

const quickActions = computed(() => {
  const actions = [
    { label: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard', color: 'primary', roles: ['admin', 'accounting', 'cashier'] },
    { label: 'Terminal', icon: 'mdi-point-of-sale', to: '/terminal', color: 'success', roles: ['admin', 'cashier'] },
    { label: 'Reports', icon: 'mdi-chart-bar', to: '/reports', color: 'info', roles: ['admin', 'accounting'] },
    { label: 'Users', icon: 'mdi-account-group', to: '/users', color: 'error', roles: ['admin'] },
  ]
  return actions.filter(a => a.roles.includes(authStore.userRole))
})

const txnHeaders = [
  { title: 'ID', key: 'id', sortable: false },
  { title: 'Time', key: 'date' },
  { title: 'Items', key: 'items', value: item => item.items.length },
  { title: 'Total', key: 'total' },
  { title: 'Payment', key: 'paymentMethod' },
  { title: 'Status', key: 'status' },
]

const recentTxns = computed(() => todayTxns.value.slice(0, 10))
</script>

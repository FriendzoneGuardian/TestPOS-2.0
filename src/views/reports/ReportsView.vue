<template>
  <div>
    <div class="text-h5 font-weight-bold mb-1">Reports</div>
    <div class="text-caption text-medium-emphasis mb-4">Sales &amp; Transaction Analytics</div>

    <!-- Filters -->
    <v-card rounded="xl" elevation="1" class="mb-4">
      <v-card-text>
        <v-row align="center" dense>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="startDate"
              label="Start Date"
              type="date"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-calendar-start"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="endDate"
              label="End Date"
              type="date"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-calendar-end"
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="4">
            <div class="d-flex ga-2 flex-wrap">
              <v-btn color="primary" variant="tonal" prepend-icon="mdi-filter" @click="applyFilter" rounded="lg">Apply</v-btn>
              <v-btn color="default" variant="tonal" prepend-icon="mdi-calendar-today" @click="setToday" rounded="lg">Today</v-btn>
              <v-btn color="default" variant="tonal" prepend-icon="mdi-calendar-week" @click="setThisWeek" rounded="lg">Week</v-btn>
              <v-btn color="success" variant="tonal" prepend-icon="mdi-download" @click="exportCSV" rounded="lg">Export</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Summary Stats -->
    <v-row class="mb-4">
      <v-col cols="6" md="3" v-for="s in summaryStats" :key="s.title">
        <v-card rounded="xl" elevation="1">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="text-caption text-medium-emphasis">{{ s.title }}</div>
              <v-icon :color="s.color" size="20">{{ s.icon }}</v-icon>
            </div>
            <div class="text-h6 font-weight-bold">{{ s.value }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Sales Chart -->
      <v-col cols="12" md="7">
        <v-card rounded="xl" elevation="1" class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">Sales by Day</v-card-title>
          <v-card-text>
            <canvas ref="salesChartRef" height="200" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Top Products -->
      <v-col cols="12" md="5">
        <v-card rounded="xl" elevation="1" class="mb-4">
          <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2">Top Products</v-card-title>
          <v-card-text class="pa-0">
            <v-list density="compact">
              <v-list-item
                v-for="(p, i) in topProducts"
                :key="p.name"
              >
                <template #prepend>
                  <v-avatar :color="i < 3 ? 'primary' : 'default'" size="28" variant="tonal">
                    <span class="text-caption">{{ i + 1 }}</span>
                  </v-avatar>
                </template>
                <template #title>{{ p.name }}</template>
                <template #subtitle>Qty: {{ p.qty }}</template>
                <template #append>
                  <span class="text-body-2 font-weight-bold text-primary">&#8369;{{ p.revenue.toFixed(2) }}</span>
                </template>
              </v-list-item>
              <v-list-item v-if="!topProducts.length">
                <template #title>No data for selected period</template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Transactions Table -->
    <v-card rounded="xl" elevation="1">
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4 pb-2 d-flex align-center justify-space-between">
        <span>Transaction Log</span>
        <v-chip size="small" color="primary" variant="tonal">{{ filteredTxns.length }} records</v-chip>
      </v-card-title>
      <v-card-text class="pa-0">
        <v-data-table
          :headers="txnHeaders"
          :items="filteredTxns"
          density="compact"
          :items-per-page="10"
          item-value="id"
        >
          <template #item.total="{ item }">
            <strong class="text-primary">&#8369;{{ item.total.toFixed(2) }}</strong>
          </template>
          <template #item.status="{ item }">
            <v-chip color="success" size="x-small" variant="tonal">{{ item.status }}</v-chip>
          </template>
          <template #item.date="{ item }">
            {{ new Date(item.date).toLocaleString() }}
          </template>
          <template #item.items="{ item }">
            {{ item.items.length }} item(s)
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const reportsStore = useReportsStore()

const startDate = ref(new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10))
const endDate = ref(new Date().toISOString().slice(0, 10))
const filteredTxns = ref([])
const topProducts = ref([])
const salesChartRef = ref(null)
let chartInstance = null

const txnHeaders = [
  { title: 'Transaction ID', key: 'id' },
  { title: 'Date/Time', key: 'date' },
  { title: 'Items', key: 'items' },
  { title: 'Total', key: 'total' },
  { title: 'Payment', key: 'paymentMethod' },
  { title: 'Cashier', key: 'cashier' },
  { title: 'Status', key: 'status' },
]

const summaryStats = computed(() => {
  const total = filteredTxns.value.reduce((s, t) => s + t.total, 0)
  const avgTxn = filteredTxns.value.length ? total / filteredTxns.value.length : 0
  const totalItems = filteredTxns.value.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0)
  return [
    { title: 'Total Revenue', value: `\u20B1${total.toFixed(2)}`, icon: 'mdi-cash-multiple', color: 'success' },
    { title: 'Transactions', value: filteredTxns.value.length, icon: 'mdi-receipt', color: 'primary' },
    { title: 'Avg. Transaction', value: `\u20B1${avgTxn.toFixed(2)}`, icon: 'mdi-chart-line', color: 'info' },
    { title: 'Items Sold', value: totalItems, icon: 'mdi-package-variant', color: 'warning' },
  ]
})

function applyFilter() {
  filteredTxns.value = reportsStore.getTransactionsByRange(startDate.value, endDate.value)
  topProducts.value = reportsStore.getTopProducts(filteredTxns.value)
  updateChart()
}

function setToday() {
  startDate.value = endDate.value = new Date().toISOString().slice(0, 10)
  applyFilter()
}

function setThisWeek() {
  startDate.value = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  endDate.value = new Date().toISOString().slice(0, 10)
  applyFilter()
}

function exportCSV() {
  const headers = ['ID', 'Date', 'Items', 'Subtotal', 'Tax', 'Total', 'Payment', 'Cashier', 'Status']
  const rows = filteredTxns.value.map(t => [
    t.id,
    new Date(t.date).toLocaleString(),
    t.items.length,
    t.subtotal.toFixed(2),
    t.tax.toFixed(2),
    t.total.toFixed(2),
    t.paymentMethod,
    t.cashier,
    t.status
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions-${startDate.value}-${endDate.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function updateChart() {
  const salesByDay = reportsStore.getSalesByDay(filteredTxns.value)
  const labels = Object.keys(salesByDay).slice(-14)
  const data = labels.map(d => salesByDay[d])

  if (chartInstance) chartInstance.destroy()
  if (!salesChartRef.value) return

  chartInstance = new Chart(salesChartRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Sales (\u20B1)',
        data,
        backgroundColor: 'rgba(34, 139, 34, 0.6)',
        borderColor: '#228B22',
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { callback: v => `\u20B1${v}` } }
      }
    }
  })
}

onMounted(() => {
  applyFilter()
})
</script>

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePosStore } from './pos'

export const useReportsStore = defineStore('reports', () => {
  const posStore = usePosStore()
  const dateRange = ref({ start: null, end: null })
  const reportType = ref('sales')

  const allTransactions = computed(() => posStore.transactions)

  function getTransactionsByRange(start, end) {
    const s = start ? new Date(start) : new Date(0)
    const e = end ? new Date(end) : new Date()
    e.setHours(23, 59, 59, 999)
    return allTransactions.value.filter(t => {
      const d = new Date(t.date)
      return d >= s && d <= e
    })
  }

  function getSalesByDay(transactions) {
    const map = {}
    transactions.forEach(t => {
      const day = new Date(t.date).toLocaleDateString()
      map[day] = (map[day] || 0) + t.total
    })
    return map
  }

  function getTopProducts(transactions) {
    const map = {}
    transactions.forEach(t => {
      t.items.forEach(item => {
        if (!map[item.name]) map[item.name] = { name: item.name, qty: 0, revenue: 0 }
        map[item.name].qty += item.qty
        map[item.name].revenue += item.price * item.qty
      })
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
  }

  return { dateRange, reportType, allTransactions, getTransactionsByRange, getSalesByDay, getTopProducts }
})

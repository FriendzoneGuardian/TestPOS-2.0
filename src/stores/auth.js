import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mock users for demo
const USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', avatar: 'A' },
  { id: 2, username: 'accounting', password: 'acc123', role: 'accounting', name: 'Jane Reyes', avatar: 'J' },
  { id: 3, username: 'cashier', password: 'cash123', role: 'cashier', name: 'Mark Santos', avatar: 'M' },
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('pos_user') || 'null'))

  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userAvatar = computed(() => user.value?.avatar || '')

  const isAdmin = computed(() => userRole.value === 'admin')
  const isAccounting = computed(() => userRole.value === 'accounting')
  const isCashier = computed(() => userRole.value === 'cashier')
  const canAccessReports = computed(() => ['admin', 'accounting'].includes(userRole.value))

  function login(username, password) {
    const found = USERS.find(u => u.username === username && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    const { password: _, ...safeUser } = found
    user.value = safeUser
    localStorage.setItem('pos_user', JSON.stringify(safeUser))
    return safeUser
  }

  function logout() {
    user.value = null
    localStorage.removeItem('pos_user')
  }

  return { user, isAuthenticated, userRole, userName, userAvatar, isAdmin, isAccounting, isCashier, canAccessReports, login, logout }
})

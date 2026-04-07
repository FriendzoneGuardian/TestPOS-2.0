import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'terminal',
        name: 'Terminal',
        component: () => import('@/views/terminal/TerminalView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'cashier'] }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/ReportsView.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'accounting'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: { requiresAuth: true, roles: ['admin'] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authCheck = () => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }
    if (to.meta.requiresGuest && auth.isAuthenticated) {
      return next({ name: 'Dashboard' })
    }
    if (to.meta.roles && !to.meta.roles.includes(auth.userRole)) {
      return next({ name: 'Dashboard' })
    }
    next()
  }
  authCheck()
})

export default router

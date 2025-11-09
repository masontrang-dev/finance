import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/credit-cards',
    name: 'CreditCards',
    component: () => import('../views/CreditCards.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/bank-accounts',
    name: 'BankAccounts',
    component: () => import('../views/BankAccounts.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  }
  // Check if route requires guest (not authenticated)
  else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'Dashboard' });
  }
  // Allow navigation
  else {
    next();
  }
});

export default router;

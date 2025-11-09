import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '../services/authService.js';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);

  /**
   * Register a new user
   */
  async function register(userData) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.register(userData);
      
      if (response.success) {
        user.value = response.data.user;
        token.value = response.data.token;
        localStorage.setItem('token', response.data.token);
        return { success: true };
      }
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Registration failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Login user
   */
  async function login(credentials) {
    loading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      
      if (response.success) {
        user.value = response.data.user;
        token.value = response.data.token;
        localStorage.setItem('token', response.data.token);
        return { success: true };
      }
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Login failed';
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch current user profile
   */
  async function fetchProfile() {
    if (!token.value) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await authService.getProfile();
      
      if (response.success) {
        user.value = response.data.user;
      }
    } catch (err) {
      // If profile fetch fails, clear auth state
      logout();
    } finally {
      loading.value = false;
    }
  }

  /**
   * Logout user
   */
  async function logout() {
    try {
      if (token.value) {
        await authService.logout();
      }
    } catch (err) {
      // Ignore errors during logout
    } finally {
      user.value = null;
      token.value = null;
      localStorage.removeItem('token');
    }
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null;
  }

  /**
   * Initialize auth state (call on app mount)
   */
  async function initialize() {
    if (token.value) {
      await fetchProfile();
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    register,
    login,
    logout,
    fetchProfile,
    clearError,
    initialize,
  };
});

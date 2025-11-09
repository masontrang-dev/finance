<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to existing account
          </router-link>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <!-- Error Message -->
        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ authStore.error }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
                <li v-for="error in validationErrors" :key="error">{{ error }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="At least 8 characters"
            />
            <p class="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const validationErrors = ref([]);

onMounted(() => {
  authStore.clearError();
});

const validateForm = () => {
  validationErrors.value = [];

  if (formData.value.name.length < 2) {
    validationErrors.value.push('Name must be at least 2 characters long');
  }

  if (formData.value.password.length < 8) {
    validationErrors.value.push('Password must be at least 8 characters long');
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    validationErrors.value.push('Passwords do not match');
  }

  return validationErrors.value.length === 0;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  const { confirmPassword, ...userData } = formData.value;
  const result = await authStore.register(userData);
  
  if (result.success) {
    router.push('/');
  }
};
</script>

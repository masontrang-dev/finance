<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Finance Tracker</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ authStore.currentUser?.name }}
            </span>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
          <p class="text-gray-600">
            Welcome to your Finance Tracker dashboard. Features will be added as we implement the user stories.
          </p>
          
          <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Placeholder cards -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Monthly Cashflow
                      </dt>
                      <dd class="mt-1 text-3xl font-semibold text-gray-900">
                        Coming Soon
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Portfolio Value
                      </dt>
                      <dd class="mt-1 text-3xl font-semibold text-gray-900">
                        Coming Soon
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Net Worth
                      </dt>
                      <dd class="mt-1 text-3xl font-semibold text-gray-900">
                        Coming Soon
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore.js';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

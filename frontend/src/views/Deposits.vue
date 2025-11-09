<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex space-x-8">
            <router-link
              to="/"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Dashboard
            </router-link>
            <router-link
              to="/credit-cards"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Credit Cards
            </router-link>
            <router-link
              to="/bank-accounts"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Bank Accounts
            </router-link>
            <router-link
              to="/deposits"
              class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
            >
              Future Deposits
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Future Deposits</h1>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Deposit
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="depositStore.error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-sm text-red-600">{{ depositStore.error }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="depositStore.loading && deposits.length === 0" class="text-center py-12">
        <p class="text-gray-500">Loading deposits...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="deposits.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No deposits</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by adding a future deposit.</p>
        <div class="mt-6">
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Deposit
          </button>
        </div>
      </div>

      <!-- Deposits Content -->
      <div v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Deposits</p>
                <p class="text-2xl font-bold text-gray-900 mt-2">{{ depositStore.depositCount }}</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Upcoming Deposits</p>
                <p class="text-2xl font-bold text-green-600 mt-2">
                  ${{ depositStore.upcomingAmount.toFixed(2) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">{{ depositStore.upcomingCount }} deposits</p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Total Amount</p>
                <p class="text-2xl font-bold text-gray-900 mt-2">
                  ${{ depositStore.totalAmount.toFixed(2) }}
                </p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Deposits Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="deposit in depositStore.sortedDeposits" :key="deposit.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(deposit.depositDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${{ deposit.amount.toFixed(2) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ deposit.description || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="isUpcoming(deposit.depositDate)"
                    class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    Upcoming
                  </span>
                  <span
                    v-else
                    class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"
                  >
                    Past
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="openEditModal(deposit)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(deposit)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Deposit Form Modal -->
    <DepositForm
      :is-open="showDepositForm"
      :deposit="selectedDeposit"
      :loading="depositStore.loading"
      @close="closeDepositForm"
      @submit="handleDepositSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this deposit? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDepositStore } from '../stores/depositStore';
import DepositForm from '../components/DepositForm.vue';
import { format, isAfter, startOfDay } from 'date-fns';

const depositStore = useDepositStore();

const showDepositForm = ref(false);
const selectedDeposit = ref(null);
const showDeleteConfirm = ref(false);
const depositToDelete = ref(null);

const deposits = computed(() => depositStore.deposits);

onMounted(async () => {
  await depositStore.fetchDeposits();
});

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const isUpcoming = (date) => {
  const today = startOfDay(new Date());
  const depositDate = new Date(date);
  return isAfter(depositDate, today) || depositDate.toDateString() === today.toDateString();
};

const openAddModal = () => {
  selectedDeposit.value = null;
  showDepositForm.value = true;
};

const openEditModal = (deposit) => {
  selectedDeposit.value = deposit;
  showDepositForm.value = true;
};

const closeDepositForm = () => {
  showDepositForm.value = false;
  selectedDeposit.value = null;
  depositStore.clearError();
};

const handleDepositSubmit = async (depositData) => {
  try {
    if (selectedDeposit.value) {
      await depositStore.updateDeposit(selectedDeposit.value.id, depositData);
    } else {
      await depositStore.createDeposit(depositData);
    }
    closeDepositForm();
  } catch (error) {
    console.error('Error saving deposit:', error);
  }
};

const confirmDelete = (deposit) => {
  depositToDelete.value = deposit;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  try {
    await depositStore.deleteDeposit(depositToDelete.value.id);
    showDeleteConfirm.value = false;
    depositToDelete.value = null;
  } catch (error) {
    console.error('Error deleting deposit:', error);
  }
};
</script>

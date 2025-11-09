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
              class="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
            >
              Bank Accounts
            </router-link>
            <router-link
              to="/deposits"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Future Deposits
            </router-link>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-700 mr-4">{{ authStore.currentUser?.name }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">Bank Accounts</h1>
          <button
            v-if="!isAddingNew"
            @click="openCreateModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Bank Account
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="bankAccountStore.error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ bankAccountStore.error }}
        </div>

        <!-- Summary Card -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Accounts</p>
              <p class="text-2xl font-bold text-gray-900">{{ bankAccountStore.accountCount }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Balance</p>
              <p class="text-2xl font-bold text-green-600">${{ formatCurrency(bankAccountStore.totalBalance) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 mb-1">Average Balance</p>
              <p class="text-2xl font-bold text-gray-900">
                ${{ formatCurrency(bankAccountStore.accountCount > 0 ? bankAccountStore.totalBalance / bankAccountStore.accountCount : 0) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="bankAccountStore.loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading bank accounts...</p>
        </div>

        <!-- Bank Accounts Table -->
        <div v-else-if="bankAccountStore.bankAccounts.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-green-600 uppercase tracking-wider">
                    Assets
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <!-- New Account Row -->
                <tr v-if="isAddingNew" class="bg-blue-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      v-model="newAccount.name"
                      type="text"
                      placeholder="Account name"
                      class="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      @keyup.enter="saveNewAccount"
                      @keyup.esc="cancelNewAccount"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex justify-end">
                      <div class="relative w-32">
                        <span class="absolute left-2 top-1 text-gray-500">$</span>
                        <input
                          v-model.number="newAccount.currentBalance"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          class="w-full pl-6 pr-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                          @keyup.enter="saveNewAccount"
                          @keyup.esc="cancelNewAccount"
                        />
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="saveNewAccount"
                        class="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        @click="cancelNewAccount"
                        class="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>

                <!-- Existing Accounts -->
                <tr
                  v-for="account in bankAccountStore.accountsByName"
                  :key="account.id"
                  class="hover:bg-gray-50"
                >
                  <!-- Account Name (Editable) -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="editingAccount?.id === account.id">
                      <input
                        v-model="editForm.name"
                        type="text"
                        class="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @keyup.enter="saveEdit(account.id)"
                        @keyup.esc="cancelEdit"
                      />
                    </div>
                    <div v-else class="text-sm font-medium text-gray-900">
                      {{ account.name }}
                    </div>
                  </td>

                  <!-- Balance (Editable) -->
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div v-if="editingAccount?.id === account.id" class="flex justify-end">
                      <div class="relative w-32">
                        <span class="absolute left-2 top-1 text-gray-500">$</span>
                        <input
                          v-model.number="editForm.currentBalance"
                          type="number"
                          step="0.01"
                          min="0"
                          class="w-full pl-6 pr-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                          @keyup.enter="saveEdit(account.id)"
                          @keyup.esc="cancelEdit"
                        />
                      </div>
                    </div>
                    <div v-else class="text-sm font-semibold text-green-600">
                      ${{ formatCurrency(account.currentBalance) }}
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div v-if="editingAccount?.id === account.id" class="flex justify-end space-x-2">
                      <button
                        @click="saveEdit(account.id)"
                        class="text-green-600 hover:text-green-900"
                      >
                        Save
                      </button>
                      <button
                        @click="cancelEdit"
                        class="text-gray-600 hover:text-gray-900"
                      >
                        Cancel
                      </button>
                    </div>
                    <div v-else class="flex justify-end space-x-2">
                      <button
                        @click="startEdit(account)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDelete(account)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-lg shadow p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No bank accounts</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by adding your first bank account.</p>
          <div class="mt-6">
            <button
              @click="openCreateModal"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Bank Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Delete Bank Account</h3>
          <p class="text-sm text-gray-500 mt-2">
            Are you sure you want to delete "{{ accountToDelete?.name }}"? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3 mt-6">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBankAccountStore } from '../stores/bankAccountStore';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const bankAccountStore = useBankAccountStore();
const authStore = useAuthStore();

const showDeleteConfirm = ref(false);
const accountToDelete = ref(null);
const editingAccount = ref(null);
const editForm = ref({
  name: '',
  currentBalance: 0,
});
const isAddingNew = ref(false);
const newAccount = ref({
  name: '',
  currentBalance: 0,
});

onMounted(async () => {
  await bankAccountStore.fetchBankAccounts();
});

const openCreateModal = () => {
  isAddingNew.value = true;
  newAccount.value = {
    name: '',
    currentBalance: 0,
  };
};

const cancelNewAccount = () => {
  isAddingNew.value = false;
  newAccount.value = {
    name: '',
    currentBalance: 0,
  };
};

const saveNewAccount = async () => {
  if (!newAccount.value.name || !newAccount.value.name.trim()) {
    alert('Account name is required');
    return;
  }

  if (newAccount.value.currentBalance < 0) {
    alert('Balance cannot be negative');
    return;
  }

  try {
    await bankAccountStore.createBankAccount({
      name: newAccount.value.name.trim(),
      currentBalance: parseFloat(newAccount.value.currentBalance) || 0,
    });
    cancelNewAccount();
  } catch (error) {
    console.error('Error creating bank account:', error);
    alert('Failed to create bank account');
  }
};

const startEdit = (account) => {
  editingAccount.value = account;
  editForm.value = {
    name: account.name,
    currentBalance: account.currentBalance,
  };
};

const cancelEdit = () => {
  editingAccount.value = null;
  editForm.value = {
    name: '',
    currentBalance: 0,
  };
};

const saveEdit = async (accountId) => {
  if (!editForm.value.name || !editForm.value.name.trim()) {
    alert('Account name is required');
    return;
  }

  if (editForm.value.currentBalance < 0) {
    alert('Balance cannot be negative');
    return;
  }

  try {
    await bankAccountStore.updateBankAccount(accountId, {
      name: editForm.value.name.trim(),
      currentBalance: parseFloat(editForm.value.currentBalance) || 0,
    });
    cancelEdit();
  } catch (error) {
    console.error('Error updating bank account:', error);
    alert('Failed to update bank account');
  }
};

const confirmDelete = (account) => {
  accountToDelete.value = account;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  if (accountToDelete.value) {
    await bankAccountStore.deleteBankAccount(accountToDelete.value.id);
    showDeleteConfirm.value = false;
    accountToDelete.value = null;
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const formatCurrency = (value) => {
  return value.toFixed(2);
};
</script>

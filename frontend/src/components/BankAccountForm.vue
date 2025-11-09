<template>
  <div v-if="isOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditMode ? 'Edit Bank Account' : 'Add Bank Account' }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <!-- Account Name -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Account Name *
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="e.g., Chase Checking"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Current Balance -->
          <div class="mb-4">
            <label for="currentBalance" class="block text-sm font-medium text-gray-700 mb-1">
              Current Balance *
            </label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-gray-500">$</span>
              <input
                id="currentBalance"
                v-model.number="formData.currentBalance"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useBankAccountStore } from '../stores/bankAccountStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  bankAccount: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'success']);

const bankAccountStore = useBankAccountStore();

const formData = ref({
  name: '',
  currentBalance: 0,
});

const loading = ref(false);
const error = ref(null);

const isEditMode = ref(false);

// Watch for changes to the bankAccount prop
watch(
  () => props.bankAccount,
  (newBankAccount) => {
    if (newBankAccount) {
      isEditMode.value = true;
      formData.value = {
        name: newBankAccount.name,
        currentBalance: newBankAccount.currentBalance,
      };
    } else {
      isEditMode.value = false;
      formData.value = {
        name: '',
        currentBalance: 0,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (isEditMode.value) {
      await bankAccountStore.updateBankAccount(props.bankAccount.id, formData.value);
    } else {
      await bankAccountStore.createBankAccount(formData.value);
    }

    emit('success');
    closeModal();
  } catch (err) {
    error.value = err.response?.data?.message || 'An error occurred';
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  formData.value = {
    name: '',
    currentBalance: 0,
  };
  error.value = null;
  emit('close');
};
</script>

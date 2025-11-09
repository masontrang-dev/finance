<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Center modal -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div>
          <div class="mt-3 text-center sm:mt-0 sm:text-left">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ isEditing ? 'Edit Credit Card' : 'Add Credit Card' }}
            </h3>
            <div class="mt-6">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Card Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">
                    Card Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    type="text"
                    id="name"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Chase Sapphire"
                  />
                  <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
                </div>

                <!-- Current Balance -->
                <div>
                  <label for="currentBalance" class="block text-sm font-medium text-gray-700">
                    Current Balance <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      v-model.number="formData.currentBalance"
                      type="number"
                      step="0.01"
                      min="0"
                      id="currentBalance"
                      required
                      class="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Amount due this month</p>
                  <p v-if="errors.currentBalance" class="mt-1 text-sm text-red-600">{{ errors.currentBalance }}</p>
                </div>

                <!-- Total Balance -->
                <div>
                  <label for="totalBalance" class="block text-sm font-medium text-gray-700">
                    Total Balance <span class="text-red-500">*</span>
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      v-model.number="formData.totalBalance"
                      type="number"
                      step="0.01"
                      min="0"
                      id="totalBalance"
                      required
                      class="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Total amount owed on card</p>
                  <p v-if="errors.totalBalance" class="mt-1 text-sm text-red-600">{{ errors.totalBalance }}</p>
                </div>

                <!-- Future Due (calculated) -->
                <div v-if="futureDue !== null" class="bg-gray-50 p-3 rounded-md">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-700">Future Due:</span>
                    <span class="text-sm font-semibold text-gray-900">
                      ${{ futureDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                    </span>
                  </div>
                  <p class="mt-1 text-xs text-gray-500">Total Balance - Current Balance</p>
                </div>

                <!-- Due Date -->
                <div>
                  <label for="dueDate" class="block text-sm font-medium text-gray-700">
                    Due Date <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.dueDate"
                    type="date"
                    id="dueDate"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p v-if="errors.dueDate" class="mt-1 text-sm text-red-600">{{ errors.dueDate }}</p>
                </div>

                <!-- General Error -->
                <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-md p-3">
                  <p class="text-sm text-red-700">{{ errors.general }}</p>
                </div>

                <!-- Form Actions -->
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="loading" class="inline-flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                    <span v-else>{{ isEditing ? 'Update' : 'Create' }}</span>
                  </button>
                  <button
                    type="button"
                    @click="$emit('close')"
                    :disabled="loading"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCreditCardStore } from '../stores/creditCardStore.js';
import { format } from 'date-fns';

const props = defineProps({
  card: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'saved']);

const creditCardStore = useCreditCardStore();

const isEditing = computed(() => !!props.card);
const loading = ref(false);
const errors = ref({});

const formData = ref({
  name: '',
  currentBalance: 0,
  totalBalance: 0,
  dueDate: '',
});

// Calculate future due
const futureDue = computed(() => {
  if (formData.value.totalBalance >= 0 && formData.value.currentBalance >= 0) {
    return formData.value.totalBalance - formData.value.currentBalance;
  }
  return null;
});

// Initialize form data if editing
if (props.card) {
  formData.value = {
    name: props.card.name,
    currentBalance: props.card.currentBalance,
    totalBalance: props.card.totalBalance,
    dueDate: format(new Date(props.card.dueDate), 'yyyy-MM-dd'),
  };
}

// Watch for card prop changes
watch(
  () => props.card,
  (newCard) => {
    if (newCard) {
      formData.value = {
        name: newCard.name,
        currentBalance: newCard.currentBalance,
        totalBalance: newCard.totalBalance,
        dueDate: format(new Date(newCard.dueDate), 'yyyy-MM-dd'),
      };
    }
  }
);

const validateForm = () => {
  errors.value = {};

  if (!formData.value.name || formData.value.name.trim() === '') {
    errors.value.name = 'Card name is required';
  }

  if (formData.value.currentBalance < 0) {
    errors.value.currentBalance = 'Current balance cannot be negative';
  }

  if (formData.value.totalBalance < 0) {
    errors.value.totalBalance = 'Total balance cannot be negative';
  }

  if (formData.value.totalBalance < formData.value.currentBalance) {
    errors.value.totalBalance = 'Total balance must be greater than or equal to current balance';
  }

  if (!formData.value.dueDate) {
    errors.value.dueDate = 'Due date is required';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  errors.value = {};

  try {
    const submitData = {
      name: formData.value.name.trim(),
      currentBalance: parseFloat(formData.value.currentBalance),
      totalBalance: parseFloat(formData.value.totalBalance),
      dueDate: new Date(formData.value.dueDate).toISOString(),
    };

    if (isEditing.value) {
      await creditCardStore.updateCreditCard(props.card.id, submitData);
    } else {
      await creditCardStore.createCreditCard(submitData);
    }

    emit('saved');
  } catch (error) {
    console.error('Error saving credit card:', error);
    if (error.response?.data?.errors) {
      // Handle validation errors from server
      error.response.data.errors.forEach((err) => {
        errors.value[err.field] = err.message;
      });
    } else {
      errors.value.general = error.response?.data?.message || 'Failed to save credit card';
    }
  } finally {
    loading.value = false;
  }
};
</script>

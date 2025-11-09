<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">{{ isEdit ? 'Edit Deposit' : 'Add Future Deposit' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <!-- Amount -->
        <div class="mb-4">
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">$</span>
            <input
              id="amount"
              v-model.number="formData.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Deposit Date -->
        <div class="mb-4">
          <label for="depositDate" class="block text-sm font-medium text-gray-700 mb-1">
            Deposit Date *
          </label>
          <input
            id="depositDate"
            v-model="formData.depositDate"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            maxlength="500"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Paycheck, Tax refund, etc."
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.description?.length || 0 }}/500 characters
          </p>
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Add Deposit') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { format } from 'date-fns';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  deposit: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  amount: '',
  depositDate: '',
  description: '',
});

const errorMessage = ref('');
const isEdit = ref(false);

// Define resetForm before using it in watch
const resetForm = () => {
  formData.value = {
    amount: '',
    depositDate: '',
    description: '',
  };
  errorMessage.value = '';
};

// Watch for deposit prop changes (for edit mode)
watch(() => props.deposit, (newDeposit) => {
  if (newDeposit) {
    isEdit.value = true;
    formData.value = {
      amount: newDeposit.amount,
      depositDate: format(new Date(newDeposit.depositDate), 'yyyy-MM-dd'),
      description: newDeposit.description || '',
    };
  } else {
    isEdit.value = false;
    resetForm();
  }
}, { immediate: true });

const handleSubmit = () => {
  errorMessage.value = '';

  // Validation
  if (!formData.value.amount || formData.value.amount <= 0) {
    errorMessage.value = 'Please enter a valid amount';
    return;
  }

  if (!formData.value.depositDate) {
    errorMessage.value = 'Please select a deposit date';
    return;
  }

  emit('submit', {
    ...formData.value,
    amount: parseFloat(formData.value.amount),
  });
};

const handleCancel = () => {
  resetForm();
  emit('close');
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <h2 class="text-2xl font-bold mb-6">Record Payment</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Credit Card Name (Read-only) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Credit Card
          </label>
          <input
            type="text"
            :value="creditCard?.name"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <!-- Current Balance (Read-only) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Current Balance
          </label>
          <input
            type="text"
            :value="formatCurrency(creditCard?.currentBalance || 0)"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <!-- Payment Amount -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Payment Amount *
          </label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500">$</span>
            <input
              v-model.number="formData.amount"
              type="number"
              step="0.01"
              min="0"
              :max="creditCard?.currentBalance"
              required
              class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <p v-if="formData.amount > (creditCard?.currentBalance || 0)" class="text-red-500 text-sm mt-1">
            Payment cannot exceed current balance
          </p>
        </div>

        <!-- Payment Date -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Payment Date *
          </label>
          <input
            v-model="formData.paymentDate"
            type="date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Notes -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            v-model="formData.notes"
            rows="3"
            maxlength="500"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add any notes about this payment..."
          ></textarea>
          <p class="text-gray-500 text-sm mt-1">
            {{ formData.notes?.length || 0 }}/500 characters
          </p>
        </div>

        <!-- Remaining Balance Preview -->
        <div v-if="formData.amount > 0" class="mb-6 p-4 bg-blue-50 rounded-md">
          <p class="text-sm text-gray-700">
            <span class="font-medium">Remaining Balance:</span>
            {{ formatCurrency((creditCard?.currentBalance || 0) - formData.amount) }}
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="loading || !isFormValid"
          >
            {{ loading ? 'Recording...' : 'Record Payment' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePaymentStore } from '../stores/paymentStore';
import { useCreditCardStore } from '../stores/creditCardStore';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  creditCard: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'payment-created']);

const paymentStore = usePaymentStore();
const creditCardStore = useCreditCardStore();

const formData = ref({
  amount: 0,
  paymentDate: new Date().toISOString().split('T')[0],
  notes: '',
});

const loading = ref(false);
const error = ref(null);

const isFormValid = computed(() => {
  return (
    formData.value.amount > 0 &&
    formData.value.amount <= (props.creditCard?.currentBalance || 0) &&
    formData.value.paymentDate
  );
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const resetForm = () => {
  formData.value = {
    amount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: '',
  };
  error.value = null;
};

const closeModal = () => {
  resetForm();
  emit('close');
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  loading.value = true;
  error.value = null;

  try {
    const result = await paymentStore.createPayment(
      props.creditCard.id,
      formData.value
    );

    // Update the credit card in the store with the new balance
    if (result.creditCard) {
      creditCardStore.creditCards = creditCardStore.creditCards.map((card) =>
        card.id === props.creditCard.id ? result.creditCard : card
      );
    }

    emit('payment-created');
    closeModal();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to record payment';
  } finally {
    loading.value = false;
  }
};

// Reset form when modal opens
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      resetForm();
    }
  }
);
</script>

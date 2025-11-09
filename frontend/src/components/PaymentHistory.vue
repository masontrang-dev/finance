<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold">Payment History</h2>
          <p class="text-gray-600 mt-1">{{ creditCard?.name }}</p>
        </div>
        <button
          @click="closeModal"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          title="Close"
        >
          <svg
            class="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Close
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Total Payments</p>
          <p class="text-2xl font-bold text-blue-600">{{ payments.length }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Total Paid</p>
          <p class="text-2xl font-bold text-green-600">
            {{ formatCurrency(totalPaid) }}
          </p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <p class="text-sm text-gray-600">Current Balance</p>
          <p class="text-2xl font-bold text-purple-600">
            {{ formatCurrency(creditCard?.currentBalance || 0) }}
          </p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">Loading payments...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="payments.length === 0" class="text-center py-12">
        <svg
          class="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="text-gray-600 text-lg">No payments recorded yet</p>
        <p class="text-gray-500 mt-2">
          Record a payment to start tracking your payment history
        </p>
      </div>

      <!-- Payment Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Notes
              </th>
              <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="payment in sortedPayments"
              :key="payment.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-4 py-3 text-sm text-gray-900">
                {{ formatDate(payment.paymentDate) }}
              </td>
              <td class="px-4 py-3 text-sm font-medium text-green-600">
                {{ formatCurrency(payment.amount) }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-600">
                {{ payment.notes || '-' }}
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  @click="handleDelete(payment)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete payment"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="cancelDelete"
      >
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm">
          <h3 class="text-lg font-bold mb-4">Confirm Delete</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete this payment? This will restore the
            payment amount to your credit card balance.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
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
import { ref, computed, watch } from 'vue';
import { usePaymentStore } from '../stores/paymentStore';
import { useCreditCardStore } from '../stores/creditCardStore';
import { format } from 'date-fns';

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

const emit = defineEmits(['close', 'payment-deleted']);

const paymentStore = usePaymentStore();
const creditCardStore = useCreditCardStore();

const loading = computed(() => paymentStore.loading);
const error = computed(() => paymentStore.error);
const payments = computed(() => paymentStore.payments);
const sortedPayments = computed(() => paymentStore.sortedPayments);
const totalPaid = computed(() => paymentStore.totalPaid);

const showDeleteConfirm = ref(false);
const paymentToDelete = ref(null);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const closeModal = () => {
  emit('close');
};

const handleDelete = (payment) => {
  paymentToDelete.value = payment;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  paymentToDelete.value = null;
  showDeleteConfirm.value = false;
};

const confirmDelete = async () => {
  if (!paymentToDelete.value) return;

  try {
    await paymentStore.deletePayment(paymentToDelete.value.id);
    
    // Refresh credit card data to get updated balance
    await creditCardStore.fetchCreditCards();
    
    emit('payment-deleted');
    cancelDelete();
  } catch (err) {
    console.error('Error deleting payment:', err);
  }
};

// Fetch payments when modal opens
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue && props.creditCard) {
      await paymentStore.fetchPayments(props.creditCard.id);
    }
  }
);
</script>

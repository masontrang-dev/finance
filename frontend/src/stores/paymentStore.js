import { defineStore } from 'pinia';
import paymentService from '../services/paymentService';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [],
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get payments sorted by date (newest first)
     */
    sortedPayments: (state) => {
      return [...state.payments].sort(
        (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
      );
    },

    /**
     * Calculate total amount paid
     */
    totalPaid: (state) => {
      return state.payments.reduce((sum, payment) => sum + payment.amount, 0);
    },
  },

  actions: {
    /**
     * Fetch all payments for a credit card
     */
    async fetchPayments(creditCardId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await paymentService.getPayments(creditCardId);
        this.payments = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch payments';
        console.error('Error fetching payments:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new payment
     */
    async createPayment(creditCardId, paymentData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await paymentService.createPayment(
          creditCardId,
          paymentData
        );
        this.payments.push(response.data.data.payment);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create payment';
        console.error('Error creating payment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete a payment
     */
    async deletePayment(paymentId) {
      this.loading = true;
      this.error = null;

      try {
        await paymentService.deletePayment(paymentId);
        this.payments = this.payments.filter((p) => p.id !== paymentId);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete payment';
        console.error('Error deleting payment:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear payments (e.g., when switching credit cards)
     */
    clearPayments() {
      this.payments = [];
      this.error = null;
    },
  },
});

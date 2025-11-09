import api from './api';

/**
 * Payment API Service
 */
const paymentService = {
  /**
   * Get all payments for a credit card
   * @param {string} creditCardId - Credit card ID
   * @returns {Promise} Payment list
   */
  getPayments(creditCardId) {
    return api.get(`/credit-cards/${creditCardId}/payments`);
  },

  /**
   * Create a new payment
   * @param {string} creditCardId - Credit card ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise} Created payment
   */
  createPayment(creditCardId, paymentData) {
    return api.post(`/credit-cards/${creditCardId}/payments`, paymentData);
  },

  /**
   * Delete a payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Deletion confirmation
   */
  deletePayment(paymentId) {
    return api.delete(`/payments/${paymentId}`);
  },
};

export default paymentService;

import api from './api.js';

/**
 * Credit Card API Service
 */
const creditCardService = {
  /**
   * Get all credit cards
   */
  getAll() {
    return api.get('/credit-cards');
  },

  /**
   * Get a single credit card by ID
   */
  getById(id) {
    return api.get(`/credit-cards/${id}`);
  },

  /**
   * Create a new credit card
   */
  create(creditCardData) {
    return api.post('/credit-cards', creditCardData);
  },

  /**
   * Update a credit card
   */
  update(id, creditCardData) {
    return api.put(`/credit-cards/${id}`, creditCardData);
  },

  /**
   * Delete a credit card
   */
  delete(id) {
    return api.delete(`/credit-cards/${id}`);
  },
};

export default creditCardService;

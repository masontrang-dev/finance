import { defineStore } from 'pinia';
import creditCardService from '../services/creditCardService.js';

export const useCreditCardStore = defineStore('creditCard', {
  state: () => ({
    creditCards: [],
    currentCard: null,
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get total current balance across all cards
     */
    totalCurrentBalance: (state) => {
      return state.creditCards.reduce((sum, card) => sum + card.currentBalance, 0);
    },

    /**
     * Get total balance across all cards
     */
    totalBalance: (state) => {
      return state.creditCards.reduce((sum, card) => sum + card.totalBalance, 0);
    },

    /**
     * Get total future due across all cards
     */
    totalFutureDue: (state) => {
      return state.creditCards.reduce((sum, card) => sum + card.futureDue, 0);
    },

    /**
     * Get cards sorted by due date
     */
    cardsByDueDate: (state) => {
      return [...state.creditCards].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    },

    /**
     * Get upcoming cards (due within 7 days)
     */
    upcomingCards: (state) => {
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);

      return state.creditCards.filter((card) => {
        const dueDate = new Date(card.dueDate);
        return dueDate >= today && dueDate <= sevenDaysFromNow;
      });
    },
  },

  actions: {
    /**
     * Fetch all credit cards
     */
    async fetchCreditCards() {
      this.loading = true;
      this.error = null;

      try {
        const response = await creditCardService.getAll();
        this.creditCards = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch credit cards';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch a single credit card by ID
     */
    async fetchCreditCard(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await creditCardService.getById(id);
        this.currentCard = response.data.data;
        return this.currentCard;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch credit card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new credit card
     */
    async createCreditCard(creditCardData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await creditCardService.create(creditCardData);
        this.creditCards.push(response.data.data);
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create credit card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update a credit card
     */
    async updateCreditCard(id, creditCardData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await creditCardService.update(id, creditCardData);
        const index = this.creditCards.findIndex((card) => card.id === id);
        if (index !== -1) {
          this.creditCards[index] = response.data.data;
        }
        if (this.currentCard?.id === id) {
          this.currentCard = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update credit card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete a credit card
     */
    async deleteCreditCard(id) {
      this.loading = true;
      this.error = null;

      try {
        await creditCardService.delete(id);
        this.creditCards = this.creditCards.filter((card) => card.id !== id);
        if (this.currentCard?.id === id) {
          this.currentCard = null;
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete credit card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null;
    },
  },
});

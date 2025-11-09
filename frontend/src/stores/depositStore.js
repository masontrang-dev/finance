import { defineStore } from 'pinia';
import depositService from '../services/depositService';
import { isAfter, isBefore, startOfDay } from 'date-fns';

export const useDepositStore = defineStore('deposit', {
  state: () => ({
    deposits: [],
    currentDeposit: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Get deposits sorted by date (earliest first)
    sortedDeposits: (state) => {
      return [...state.deposits].sort((a, b) => 
        new Date(a.depositDate) - new Date(b.depositDate)
      );
    },

    // Get upcoming deposits (future dates)
    upcomingDeposits: (state) => {
      const today = startOfDay(new Date());
      return state.deposits.filter((deposit) => 
        isAfter(new Date(deposit.depositDate), today) || 
        new Date(deposit.depositDate).toDateString() === today.toDateString()
      );
    },

    // Get past deposits
    pastDeposits: (state) => {
      const today = startOfDay(new Date());
      return state.deposits.filter((deposit) => 
        isBefore(new Date(deposit.depositDate), today)
      );
    },

    // Total amount of all deposits
    totalAmount: (state) => {
      return state.deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    },

    // Total amount of upcoming deposits
    upcomingAmount() {
      return this.upcomingDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    },

    // Total amount of past deposits
    pastAmount() {
      return this.pastDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    },

    // Number of deposits
    depositCount: (state) => state.deposits.length,

    // Number of upcoming deposits
    upcomingCount() {
      return this.upcomingDeposits.length;
    },
  },

  actions: {
    async fetchDeposits() {
      this.loading = true;
      this.error = null;
      try {
        const response = await depositService.getAll();
        this.deposits = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch deposits';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchDeposit(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await depositService.getById(id);
        this.currentDeposit = response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch deposit';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createDeposit(depositData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await depositService.create(depositData);
        this.deposits.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || error.response?.data?.errors || 'Failed to create deposit';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateDeposit(id, depositData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await depositService.update(id, depositData);
        const index = this.deposits.findIndex((d) => d.id === id);
        if (index !== -1) {
          this.deposits[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || error.response?.data?.errors || 'Failed to update deposit';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteDeposit(id) {
      this.loading = true;
      this.error = null;
      try {
        await depositService.delete(id);
        this.deposits = this.deposits.filter((d) => d.id !== id);
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete deposit';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },
});

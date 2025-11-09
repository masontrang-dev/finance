import { defineStore } from 'pinia';
import bankAccountService from '../services/bankAccountService';

export const useBankAccountStore = defineStore('bankAccount', {
  state: () => ({
    bankAccounts: [],
    currentBankAccount: null,
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get total balance across all bank accounts
     */
    totalBalance: (state) => {
      return state.bankAccounts.reduce((sum, account) => sum + account.currentBalance, 0);
    },

    /**
     * Get bank accounts sorted by name
     */
    accountsByName: (state) => {
      return [...state.bankAccounts].sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * Get bank accounts sorted by balance (highest first)
     */
    accountsByBalance: (state) => {
      return [...state.bankAccounts].sort((a, b) => b.currentBalance - a.currentBalance);
    },

    /**
     * Get number of bank accounts
     */
    accountCount: (state) => {
      return state.bankAccounts.length;
    },
  },

  actions: {
    /**
     * Fetch all bank accounts
     */
    async fetchBankAccounts() {
      this.loading = true;
      this.error = null;

      try {
        const response = await bankAccountService.getBankAccounts();
        this.bankAccounts = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch bank accounts';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch a single bank account
     */
    async fetchBankAccount(id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await bankAccountService.getBankAccount(id);
        this.currentBankAccount = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch bank account';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create a new bank account
     */
    async createBankAccount(bankAccountData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await bankAccountService.createBankAccount(bankAccountData);
        this.bankAccounts.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create bank account';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update a bank account
     */
    async updateBankAccount(id, bankAccountData) {
      this.loading = true;
      this.error = null;

      try {
        const response = await bankAccountService.updateBankAccount(id, bankAccountData);
        const index = this.bankAccounts.findIndex((account) => account.id === id);
        if (index !== -1) {
          this.bankAccounts[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update bank account';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete a bank account
     */
    async deleteBankAccount(id) {
      this.loading = true;
      this.error = null;

      try {
        await bankAccountService.deleteBankAccount(id);
        this.bankAccounts = this.bankAccounts.filter((account) => account.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete bank account';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear error message
     */
    clearError() {
      this.error = null;
    },
  },
});

import api from './api';

/**
 * Bank Account Service
 * Handles all API calls related to bank accounts
 */

/**
 * Get all bank accounts for the authenticated user
 */
export const getBankAccounts = async () => {
  const response = await api.get('/bank-accounts');
  return response.data;
};

/**
 * Get a single bank account by ID
 */
export const getBankAccount = async (id) => {
  const response = await api.get(`/bank-accounts/${id}`);
  return response.data;
};

/**
 * Create a new bank account
 */
export const createBankAccount = async (bankAccountData) => {
  const response = await api.post('/bank-accounts', bankAccountData);
  return response.data;
};

/**
 * Update a bank account
 */
export const updateBankAccount = async (id, bankAccountData) => {
  const response = await api.put(`/bank-accounts/${id}`, bankAccountData);
  return response.data;
};

/**
 * Delete a bank account
 */
export const deleteBankAccount = async (id) => {
  const response = await api.delete(`/bank-accounts/${id}`);
  return response.data;
};

export default {
  getBankAccounts,
  getBankAccount,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
};

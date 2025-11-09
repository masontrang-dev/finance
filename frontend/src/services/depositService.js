import api from './api';

const depositService = {
  // Get all deposits
  getAll() {
    return api.get('/deposits');
  },

  // Get a single deposit by ID
  getById(id) {
    return api.get(`/deposits/${id}`);
  },

  // Create a new deposit
  create(depositData) {
    return api.post('/deposits', depositData);
  },

  // Update a deposit
  update(id, depositData) {
    return api.put(`/deposits/${id}`, depositData);
  },

  // Delete a deposit
  delete(id) {
    return api.delete(`/deposits/${id}`);
  },
};

export default depositService;

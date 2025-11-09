<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Credit Cards</h1>
            <p class="mt-1 text-sm text-gray-500">
              Manage your credit cards and track balances
            </p>
          </div>
          <button
            @click="startAddingNew"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              class="-ml-1 mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Credit Card
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-6 bg-red-50 border border-red-200 rounded-md p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="clearError"
              class="inline-flex text-red-400 hover:text-red-500"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading credit cards...</p>
      </div>

      <!-- Credit Cards Table -->
      <div v-else-if="creditCards.length > 0" class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider">
                  Debts
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Current Due
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Future Due
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Total Balance
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- New Card Row -->
              <tr v-if="isAddingNew" class="bg-blue-50 border-l-4 border-blue-500">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <input
                        v-model="newCard.name"
                        @keyup.enter="saveNewCard"
                        @keyup.esc="cancelNewCard"
                        ref="newCardNameInput"
                        type="text"
                        placeholder="Card name"
                        class="text-sm font-medium text-gray-900 border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style="width: 150px"
                      />
                      <input
                        v-model="newCard.dueDate"
                        @keyup.enter="saveNewCard"
                        @keyup.esc="cancelNewCard"
                        type="date"
                        class="mt-1 text-sm text-gray-500 border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style="width: 150px"
                      />
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  <input
                    v-model.number="newCard.currentBalance"
                    @keyup.enter="saveNewCard"
                    @keyup.esc="cancelNewCard"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="text-right border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style="width: 120px"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-blue-600">
                  <span v-if="newCard.totalBalance && newCard.currentBalance">
                    {{ (newCard.totalBalance - newCard.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </span>
                  <span v-else class="text-gray-400">0.00</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  <input
                    v-model.number="newCard.totalBalance"
                    @keyup.enter="saveNewCard"
                    @keyup.esc="cancelNewCard"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="text-right border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style="width: 120px"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    @click="saveNewCard"
                    class="text-green-600 hover:text-green-900 font-semibold"
                  >
                    Save
                  </button>
                  <button
                    @click="cancelNewCard"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
              
              <!-- Existing Cards -->
              <tr
                v-for="card in cardsByDueDate"
                :key="card.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div>
                      <div
                        v-if="editingCard?.id === card.id && editingField === 'name'"
                        class="flex items-center"
                      >
                        <input
                          v-model="editValue"
                          @blur="saveEdit(card)"
                          @keyup.enter="saveEdit(card)"
                          @keyup.esc="cancelEdit"
                          ref="editInput"
                          type="text"
                          class="text-sm font-medium text-gray-900 border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style="width: 150px"
                        />
                      </div>
                      <div
                        v-else
                        @click="startEdit(card, 'name', card.name)"
                        class="text-sm font-medium text-gray-900 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        {{ card.name }}
                      </div>
                      <div
                        v-if="editingCard?.id === card.id && editingField === 'dueDate'"
                        class="flex items-center"
                      >
                        <input
                          v-model="editValue"
                          @blur="saveEdit(card)"
                          @keyup.enter="saveEdit(card)"
                          @keyup.esc="cancelEdit"
                          ref="editInput"
                          type="date"
                          class="text-sm text-gray-500 border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style="width: 150px"
                        />
                      </div>
                      <div
                        v-else
                        @click="startEdit(card, 'dueDate', formatDateForInput(card.dueDate))"
                        class="text-sm text-gray-500 cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                      >
                        ({{ formatDateShort(card.dueDate) }})
                      </div>
                    </div>
                    <span
                      v-if="isUpcoming(card.dueDate)"
                      class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      Due Soon
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  <div
                    v-if="editingCard?.id === card.id && editingField === 'currentBalance'"
                    class="flex justify-end"
                  >
                    <input
                      v-model.number="editValue"
                      @blur="saveEdit(card)"
                      @keyup.enter="saveEdit(card)"
                      @keyup.esc="cancelEdit"
                      ref="editInput"
                      type="number"
                      step="0.01"
                      min="0"
                      class="text-right border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style="width: 120px"
                    />
                  </div>
                  <div
                    v-else
                    @click="startEdit(card, 'currentBalance', card.currentBalance)"
                    class="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded inline-block"
                  >
                    {{ card.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-blue-600">
                  {{ card.futureDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  <div
                    v-if="editingCard?.id === card.id && editingField === 'totalBalance'"
                    class="flex justify-end"
                  >
                    <input
                      v-model.number="editValue"
                      @blur="saveEdit(card)"
                      @keyup.enter="saveEdit(card)"
                      @keyup.esc="cancelEdit"
                      ref="editInput"
                      type="number"
                      step="0.01"
                      min="0"
                      class="text-right border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style="width: 120px"
                    />
                  </div>
                  <div
                    v-else
                    @click="startEdit(card, 'totalBalance', card.totalBalance)"
                    class="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded inline-block"
                  >
                    {{ card.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="confirmDelete(card)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  Net Total
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                  {{ totalCurrentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-blue-600">
                  {{ totalFutureDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                  {{ totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </td>
                <td class="px-6 py-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <svg
            class="h-12 w-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No credit cards yet</h3>
        <p class="text-gray-600 mb-8 max-w-sm mx-auto">
          Start tracking your credit card balances and due dates by adding your first card.
        </p>
        <button
          @click="startAddingNew"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm hover:shadow transition-all"
        >
          <svg
            class="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Your First Card
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showDeleteConfirm = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Delete Credit Card
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete "{{ cardToDelete?.name }}"? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="handleDelete"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              @click="showDeleteConfirm = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useCreditCardStore } from '../stores/creditCardStore.js';
import { format } from 'date-fns';

const creditCardStore = useCreditCardStore();

const showDeleteConfirm = ref(false);
const cardToDelete = ref(null);

// Inline editing state
const editingCard = ref(null);
const editingField = ref(null);
const editValue = ref(null);
const editInput = ref(null);

// New card state
const isAddingNew = ref(false);
const newCardNameInput = ref(null);
const newCard = ref({
  name: '',
  currentBalance: 0,
  totalBalance: 0,
  dueDate: '',
});

// Computed properties from store
const creditCards = computed(() => creditCardStore.creditCards);
const cardsByDueDate = computed(() => creditCardStore.cardsByDueDate);
const totalCurrentBalance = computed(() => creditCardStore.totalCurrentBalance);
const totalBalance = computed(() => creditCardStore.totalBalance);
const totalFutureDue = computed(() => creditCardStore.totalFutureDue);
const loading = computed(() => creditCardStore.loading);
const error = computed(() => creditCardStore.error);

// Methods
const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

const formatDateShort = (date) => {
  return format(new Date(date), 'M/d');
};

const formatDateForInput = (date) => {
  return format(new Date(date), 'yyyy-MM-dd');
};

const isUpcoming = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);
  return due >= today && due <= sevenDaysFromNow;
};

// Inline editing methods
const startEdit = (card, field, value) => {
  editingCard.value = card;
  editingField.value = field;
  editValue.value = value;
  
  // Focus input on next tick
  setTimeout(() => {
    if (editInput.value) {
      const input = Array.isArray(editInput.value) ? editInput.value[0] : editInput.value;
      if (input) {
        input.focus();
        if (field !== 'dueDate') {
          input.select();
        }
      }
    }
  }, 50);
};

const cancelEdit = () => {
  editingCard.value = null;
  editingField.value = null;
  editValue.value = null;
};

const saveEdit = async (card) => {
  if (!editingField.value || editValue.value === null || editValue.value === '') {
    cancelEdit();
    return;
  }

  try {
    const updateData = {};
    
    if (editingField.value === 'dueDate') {
      updateData.dueDate = new Date(editValue.value).toISOString();
    } else if (editingField.value === 'currentBalance' || editingField.value === 'totalBalance') {
      const numValue = parseFloat(editValue.value);
      if (isNaN(numValue) || numValue < 0) {
        cancelEdit();
        return;
      }
      updateData[editingField.value] = numValue;
      
      // Validate that totalBalance >= currentBalance
      if (editingField.value === 'totalBalance' && numValue < card.currentBalance) {
        alert('Total balance must be greater than or equal to current balance');
        cancelEdit();
        return;
      }
      if (editingField.value === 'currentBalance' && numValue > card.totalBalance) {
        alert('Current balance cannot be greater than total balance');
        cancelEdit();
        return;
      }
    } else {
      updateData[editingField.value] = editValue.value.trim();
    }

    await creditCardStore.updateCreditCard(card.id, updateData);
    cancelEdit();
  } catch (error) {
    console.error('Error updating credit card:', error);
    alert('Failed to update credit card');
    cancelEdit();
  }
};

const confirmDelete = (card) => {
  cardToDelete.value = card;
  showDeleteConfirm.value = true;
};

const handleDelete = async () => {
  try {
    await creditCardStore.deleteCreditCard(cardToDelete.value.id);
    showDeleteConfirm.value = false;
    cardToDelete.value = null;
  } catch (error) {
    console.error('Error deleting credit card:', error);
  }
};

const clearError = () => {
  creditCardStore.clearError();
};

// New card methods
const startAddingNew = () => {
  isAddingNew.value = true;
  newCard.value = {
    name: '',
    currentBalance: 0,
    totalBalance: 0,
    dueDate: '',
  };
  
  // Focus the name input
  nextTick(() => {
    if (newCardNameInput.value) {
      newCardNameInput.value.focus();
    }
  });
};

const cancelNewCard = () => {
  isAddingNew.value = false;
  newCard.value = {
    name: '',
    currentBalance: 0,
    totalBalance: 0,
    dueDate: '',
  };
};

const saveNewCard = async () => {
  // Validate required fields
  if (!newCard.value.name || !newCard.value.name.trim()) {
    alert('Card name is required');
    return;
  }
  
  if (!newCard.value.dueDate) {
    alert('Due date is required');
    return;
  }
  
  if (newCard.value.currentBalance < 0 || newCard.value.totalBalance < 0) {
    alert('Balances cannot be negative');
    return;
  }
  
  if (newCard.value.totalBalance < newCard.value.currentBalance) {
    alert('Total balance must be greater than or equal to current balance');
    return;
  }
  
  try {
    const cardData = {
      name: newCard.value.name.trim(),
      currentBalance: parseFloat(newCard.value.currentBalance) || 0,
      totalBalance: parseFloat(newCard.value.totalBalance) || 0,
      dueDate: new Date(newCard.value.dueDate).toISOString(),
    };
    
    await creditCardStore.createCreditCard(cardData);
    cancelNewCard();
  } catch (error) {
    console.error('Error creating credit card:', error);
    alert('Failed to create credit card');
  }
};

// Lifecycle
onMounted(() => {
  creditCardStore.fetchCreditCards();
});
</script>

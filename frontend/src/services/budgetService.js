const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || 'Request failed.';
    throw new Error(message);
  }

  return payload;
}

export const budgetService = {
  getBudget: (tripId, token) =>
    request(`/api/trips/${tripId}/budget`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),

  listExpenses: (tripId, token) =>
    request(`/api/trips/${tripId}/expenses`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),

  addExpense: (tripId, expense, token) =>
    request(`/api/trips/${tripId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(expense),
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateExpense: (tripId, expenseId, expense, token) =>
    request(`/api/trips/${tripId}/expenses/${expenseId}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
      headers: { Authorization: `Bearer ${token}` },
    }),

  deleteExpense: (tripId, expenseId, token) =>
    request(`/api/trips/${tripId}/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

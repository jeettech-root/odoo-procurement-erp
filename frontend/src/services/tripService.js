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

export const tripService = {
  getTrips: (token) =>
    request('/api/trips', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),
  getTrip: (token, id) =>
    request(`/api/trips/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),
  createTrip: (token, data) =>
    request('/api/trips', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateTrip: (token, id, data) =>
    request(`/api/trips/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),
  deleteTrip: (token, id) =>
    request(`/api/trips/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

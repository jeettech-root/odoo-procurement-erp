const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function request(endpoint, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (_error) {
    payload = text;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || 'Trip request failed.');
    error.status = response.status;
    error.body = payload;
    throw error;
  }

  return payload;
}

export const tripService = {
  getTrips: (token) => request('/api/trips', token),
  getTrip: (token, id) => request(`/api/trips/${id}`, token),
  createTrip: (token, data) => request('/api/trips', token, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTrip: (token, id, data) => request(`/api/trips/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteTrip: (token, id) => request(`/api/trips/${id}`, token, { method: 'DELETE' }),
};
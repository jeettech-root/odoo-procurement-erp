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

export const timelineService = {
  getTimeline: (tripId, token) =>
    request(`/api/trips/${tripId}/timeline`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

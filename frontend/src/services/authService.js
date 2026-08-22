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

export const authService = {
  signup: (payload) =>
    request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getCurrentUser: (token) =>
    request('/api/auth/me', {
      method: 'GET',
      headers: { ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    }),
};

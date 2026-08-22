const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/api/itinerary`;

async function request(path, opts = {}, token) {
  const res = await fetch(path, {
    ...opts,
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch (error) {
    json = text;
  }

  if (!res.ok) {
    const err = new Error(json && json.error ? json.error : res.statusText);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

export async function searchCities(q, country, token) {
  const params = new URLSearchParams();
  params.set('q', q);
  if (country) params.set('country', country);
  return request(`${API_BASE}/search/cities?${params.toString()}`, {}, token);
}

export async function searchActivities(q, cityId, token) {
  const params = new URLSearchParams();
  params.set('q', q);
  if (cityId) params.set('cityId', cityId);
  return request(`${API_BASE}/search/activities?${params.toString()}`, {}, token);
}

export async function getItinerary(tripId, token) {
  return request(`${API_BASE}/trips/${tripId}/stops`, {}, token);
}

export async function createStop(payload, token) {
  return request(
    `${API_BASE}/stops`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
    token,
  );
}

export async function updateStop(id, payload, token) {
  return request(
    `${API_BASE}/stops/${id}`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
    token,
  );
}

export async function deleteStop(id, token) {
  return request(`${API_BASE}/stops/${id}`, { method: 'DELETE' }, token);
}

export async function reorderStops(tripId, order, token) {
  return request(
    `${API_BASE}/trips/${tripId}/stops/reorder`,
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order }) },
    token,
  );
}

export async function getActivitiesForStop(stopId, token) {
  return request(`${API_BASE}/stops/${stopId}/activities`, {}, token);
}

export async function assignActivityToStop(stopId, payload, token) {
  return request(
    `${API_BASE}/stops/${stopId}/activities`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
    token,
  );
}

export async function removeActivityFromStop(stopId, assignmentId, token) {
  return request(`${API_BASE}/stops/${stopId}/activities/${assignmentId}`, { method: 'DELETE' }, token);
}

export async function listCities(token) {
  return request(`${API_BASE}/cities`, {}, token);
}

export async function listActivities(token) {
  return request(`${API_BASE}/activities`, {}, token);
}

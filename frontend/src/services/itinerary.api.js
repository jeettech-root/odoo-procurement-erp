const API_BASE = '/api/itinerary';

async function request(path, opts = {}) {
  const res = await fetch(path, opts);
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch(e) { json = text; }
  if (!res.ok) {
    const err = new Error(json && json.error ? json.error : res.statusText);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

export async function searchCities(q, country) {
  const params = new URLSearchParams();
  params.set('q', q);
  if (country) params.set('country', country);
  return request(`${API_BASE}/search/cities?${params.toString()}`);
}

export async function searchActivities(q, cityId) {
  const params = new URLSearchParams();
  params.set('q', q);
  if (cityId) params.set('cityId', cityId);
  return request(`${API_BASE}/search/activities?${params.toString()}`);
}

export async function getItinerary(tripId) {
  return request(`${API_BASE}/trips/${tripId}/stops`);
}

export async function createStop(payload) {
  return request(`${API_BASE}/stops`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export async function updateStop(id, payload) {
  return request(`${API_BASE}/stops/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export async function deleteStop(id) {
  return request(`${API_BASE}/stops/${id}`, { method: 'DELETE' });
}

export async function reorderStops(tripId, order) {
  return request(`${API_BASE}/trips/${tripId}/stops/reorder`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order }) });
}

export async function getActivitiesForStop(stopId) {
  return request(`${API_BASE}/stops/${stopId}/activities`);
}

export async function assignActivityToStop(stopId, payload) {
  return request(`${API_BASE}/stops/${stopId}/activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
}

export async function removeActivityFromStop(stopId, assignmentId) {
  return request(`${API_BASE}/stops/${stopId}/activities/${assignmentId}`, { method: 'DELETE' });
}

export async function listCities() {
  return request(`${API_BASE}/cities`);
}

export async function listActivities() {
  return request(`${API_BASE}/activities`);
}

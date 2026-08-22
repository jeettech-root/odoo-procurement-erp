import * as service from '../services/itinerary.service.js';

// Cities
export async function listCities(_req, res) {
  const cities = await service.listCities();
  res.json(cities);
}

export async function searchCities(req, res) {
  const { q: query, country } = req.query;
  if (!query) return res.status(400).json({ error: 'q (query) parameter is required' });
  const results = await service.searchCities(query, country);
  res.json(results);
}

export async function createCity(req, res) {
  const payload = req.body || {};
  const { name, country } = payload;
  if (!name || !name.trim()) return res.status(400).json({ error: 'name is required' });
  if (!country || !country.trim()) return res.status(400).json({ error: 'country is required' });

  // Check if city exists first
  const existing = await service.findCityByNameAndCountry(name, country);
  if (existing) {
    // return existing city (client will use it)
    return res.json(existing);
  }

  try {
    const city = await service.createCity(payload);
    return res.status(201).json(city);
  } catch (e) {
    console.error('Error creating city', e);
    return res.status(500).json({ error: 'Could not create city' });
  }
}

export async function getCity(req, res) {
  const { id } = req.params;
  const city = await service.getCity(id);
  if (!city) return res.status(404).json({ error: 'City not found' });
  res.json(city);
}

export async function deleteCity(req, res) {
  const { id } = req.params;
  await service.deleteCity(id);
  res.status(204).send();
}

// Activities
export async function listActivities(_req, res) {
  const activities = await service.listActivities();
  res.json(activities);
}

export async function searchActivities(req, res) {
  const { q: query, cityId } = req.query;
  if (!query) return res.status(400).json({ error: 'q (query) parameter is required' });
  const results = await service.searchActivities(query, cityId);
  res.json(results);
}

export async function createActivity(req, res) {
  const payload = req.body;
  const activity = await service.createActivity(payload);
  res.status(201).json(activity);
}

export async function getActivity(req, res) {
  const { id } = req.params;
  const activity = await service.getActivity(id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  res.json(activity);
}

export async function deleteActivity(req, res) {
  const { id } = req.params;
  await service.deleteActivity(id);
  res.status(204).send();
}

// Trip stops
export async function listStops(req, res) {
  const { tripId } = req.query;
  const stops = await service.listStops(tripId);
  res.json(stops);
}

export async function getItineraryForTrip(req, res) {
  const { tripId } = req.params;
  const stops = await service.getItineraryForTrip(tripId);
  res.json(stops);
}

export async function createStop(req, res) {
  const payload = req.body;
  if (!payload.tripId || !payload.cityId || !payload.startDate || !payload.endDate) {
    return res.status(400).json({ error: 'tripId, cityId, startDate and endDate are required' });
  }
  const stop = await service.createStop(payload);
  res.status(201).json(stop);
}

export async function getStop(req, res) {
  const { id } = req.params;
  const stop = await service.getStop(id);
  if (!stop) return res.status(404).json({ error: 'Stop not found' });
  res.json(stop);
}

export async function updateStop(req, res) {
  const { id } = req.params;
  const payload = req.body;
  // Allow only date and position/notes updates via this endpoint
  const allowed = {};
  if (payload.startDate) allowed.startDate = payload.startDate;
  if (payload.endDate) allowed.endDate = payload.endDate;
  if (payload.position !== undefined) allowed.position = payload.position;
  if (payload.notes !== undefined) allowed.notes = payload.notes;
  const updated = await service.updateStop(id, allowed);
  res.json(updated);
}

export async function deleteStop(req, res) {
  const { id } = req.params;
  await service.deleteStop(id);
  res.status(204).send();
}

export async function reorderStops(req, res) {
  const { tripId } = req.params;
  const { order } = req.body;
  if (!Array.isArray(order) || order.length === 0) {
    return res.status(400).json({ error: 'order must be a non-empty array of stop IDs' });
  }
  const result = await service.reorderStops(tripId, order);
  res.json({ message: 'Reordered', updated: result });
}

// Activities for a stop
export async function getActivitiesForStop(req, res) {
  const { id: stopId } = req.params;
  const acts = await service.getActivitiesForStop(stopId);
  res.json(acts);
}

// Assignments
export async function assignActivityToStop(req, res) {
  const { id: stopId } = req.params;
  const { activityId, position } = req.body;
  if (!activityId) return res.status(400).json({ error: 'activityId is required' });
  try {
    const assignment = await service.assignActivityToStop({ stopId, activityId, position });
    res.status(201).json(assignment);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Activity already assigned to this stop' });
    }
    throw e;
  }
}

export async function removeActivityFromStop(req, res) {
  const { assignmentId } = req.params;
  await service.removeActivityFromStop(assignmentId);
  res.status(204).send();
}

import * as service from '../services/itinerary.service.js';

// Cities
export async function listCities(_req, res) {
  const cities = await service.listCities();
  res.json(cities);
}

export async function createCity(req, res) {
  const payload = req.body;
  const city = await service.createCity(payload);
  res.status(201).json(city);
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

export async function createStop(req, res) {
  const payload = req.body;
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
  const updated = await service.updateStop(id, payload);
  res.json(updated);
}

export async function deleteStop(req, res) {
  const { id } = req.params;
  await service.deleteStop(id);
  res.status(204).send();
}

// Assignments
export async function assignActivityToStop(req, res) {
  const { id: stopId } = req.params;
  const { activityId, position } = req.body;
  if (!activityId) return res.status(400).json({ error: 'activityId is required' });
  const assignment = await service.assignActivityToStop({ stopId, activityId, position });
  res.status(201).json(assignment);
}

export async function removeActivityFromStop(req, res) {
  const { assignmentId } = req.params;
  await service.removeActivityFromStop(assignmentId);
  res.status(204).send();
}

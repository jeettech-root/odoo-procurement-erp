import { prisma } from '../utils/prisma.js';

// Cities
export async function listCities() {
  return prisma.city.findMany({ orderBy: { name: 'asc' } });
}

export async function createCity(data) {
  const { name, country, slug, lat, lon, description } = data;
  return prisma.city.create({ data: { name, country, slug, lat, lon, description } });
}

export async function getCity(id) {
  return prisma.city.findUnique({ where: { id } });
}

export async function deleteCity(id) {
  // cascade is not set on City -> Activities by default in schema; delete assignments first
  await prisma.activity.deleteMany({ where: { cityId: id } });
  await prisma.city.delete({ where: { id } });
}

// Activities
export async function listActivities() {
  return prisma.activity.findMany({ orderBy: { name: 'asc' } });
}

export async function createActivity(data) {
  const { name, description, cityId, durationMins, price } = data;
  return prisma.activity.create({ data: { name, description, cityId, durationMins, price } });
}

export async function getActivity(id) {
  return prisma.activity.findUnique({ where: { id } });
}

export async function deleteActivity(id) {
  // remove assignments first
  await prisma.tripStopActivity.deleteMany({ where: { activityId: id } });
  await prisma.activity.delete({ where: { id } });
}

// Trip stops
export async function listStops(tripId) {
  const where = tripId ? { tripId } : undefined;
  return prisma.tripStop.findMany({ where, orderBy: { position: 'asc' } });
}

export async function createStop(data) {
  const { tripId, cityId, startDate, endDate, position, notes } = data;
  return prisma.tripStop.create({ data: { tripId, cityId, startDate: new Date(startDate), endDate: new Date(endDate), position, notes } });
}

export async function getStop(id) {
  return prisma.tripStop.findUnique({ where: { id }, include: { activities: { include: { activity: true } }, city: true } });
}

export async function updateStop(id, data) {
  const updateData = {};
  if (data.cityId) updateData.cityId = data.cityId;
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);
  if (data.position !== undefined) updateData.position = data.position;
  if (data.notes !== undefined) updateData.notes = data.notes;
  return prisma.tripStop.update({ where: { id }, data: updateData });
}

export async function deleteStop(id) {
  // delete assignments first
  await prisma.tripStopActivity.deleteMany({ where: { stopId: id } });
  await prisma.tripStop.delete({ where: { id } });
}

// Assignments
export async function assignActivityToStop({ stopId, activityId, position }) {
  return prisma.tripStopActivity.create({ data: { stopId, activityId, position } });
}

export async function removeActivityFromStop(assignmentId) {
  return prisma.tripStopActivity.delete({ where: { id: assignmentId } });
}

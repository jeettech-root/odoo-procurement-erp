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

export async function getItineraryForTrip(tripId) {
  return prisma.tripStop.findMany({ where: { tripId }, orderBy: { position: 'asc' }, include: { city: true, activities: { include: { activity: true } } } });
}

export async function createStop(data) {
  const { tripId, cityId, startDate, endDate, position, notes } = data;
  // ensure trip exists
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new Error('Trip not found');

  // if position not supplied, append at end
  let pos = position;
  if (pos === undefined || pos === null) {
    const max = await prisma.tripStop.findMany({ where: { tripId }, orderBy: { position: 'desc' }, take: 1 });
    pos = max.length ? max[0].position + 1 : 0;
  } else {
    // shift existing stops >= pos
    await prisma.tripStop.updateMany({ where: { tripId, position: { gte: pos } }, data: { position: { increment: 1 } } });
  }

  return prisma.tripStop.create({ data: { tripId, cityId, startDate: new Date(startDate), endDate: new Date(endDate), position: pos, notes } });
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

export async function reorderStops(tripId, order) {
  // order is array of stopIds in desired order
  const stops = await prisma.tripStop.findMany({ where: { tripId } });
  const stopIds = stops.map(s => s.id);
  if (order.length !== stopIds.length || !order.every(id => stopIds.includes(id))) {
    throw new Error('Order must include all stop IDs for the trip');
  }

  const updates = order.map((id, idx) => prisma.tripStop.update({ where: { id }, data: { position: idx } }));
  return prisma.$transaction(updates);
}

// Activities for a stop
export async function getActivitiesForStop(stopId) {
  return prisma.tripStopActivity.findMany({ where: { stopId }, orderBy: { position: 'asc' }, include: { activity: true } });
}

// Assignments
export async function assignActivityToStop({ stopId, activityId, position }) {
  // prevent duplicate assignment
  const existing = await prisma.tripStopActivity.findFirst({ where: { stopId, activityId } });
  if (existing) {
    const err = new Error('Already assigned');
    err.code = 'P2002';
    throw err;
  }

  // if position not provided, append
  let pos = position;
  if (pos === undefined || pos === null) {
    const max = await prisma.tripStopActivity.findMany({ where: { stopId }, orderBy: { position: 'desc' }, take: 1 });
    pos = max.length ? max[0].position + 1 : 0;
  } else {
    // shift existing activities >= pos
    await prisma.tripStopActivity.updateMany({ where: { stopId, position: { gte: pos } }, data: { position: { increment: 1 } } });
  }

  return prisma.tripStopActivity.create({ data: { stopId, activityId, position: pos } });
}

export async function removeActivityFromStop(assignmentId) {
  return prisma.tripStopActivity.delete({ where: { id: assignmentId } });
}

// Search
export async function searchCities(query, country) {
  const where = country ? { name: { contains: query, mode: 'insensitive' }, country } : { name: { contains: query, mode: 'insensitive' } };
  return prisma.city.findMany({ where, orderBy: { name: 'asc' }, take: 20 });
}

export async function searchActivities(query, cityId) {
  const where = cityId ? { name: { contains: query, mode: 'insensitive' }, cityId } : { name: { contains: query, mode: 'insensitive' } };
  return prisma.activity.findMany({ where, orderBy: { name: 'asc' }, take: 50, include: { city: true } });
}

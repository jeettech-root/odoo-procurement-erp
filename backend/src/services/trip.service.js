import { prisma } from '../utils/prisma.js';

export const createTrip = (userId, data) => prisma.trip.create({
  data: {
    ...data,
    userId,
  },
});

export const getUserTrips = (userId) => prisma.trip.findMany({
  where: { userId },
  orderBy: { startDate: 'asc' },
});

export const getUserTrip = (userId, tripId) => prisma.trip.findFirst({
  where: {
    id: tripId,
    userId,
  },
});

export const updateUserTrip = (userId, tripId, data) => prisma.trip.updateMany({
  where: {
    id: tripId,
    userId,
  },
  data,
});

export const deleteUserTrip = (userId, tripId) => prisma.trip.deleteMany({
  where: {
    id: tripId,
    userId,
  },
});

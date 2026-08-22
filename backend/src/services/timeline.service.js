import { prisma } from '../utils/prisma.js';

export async function getTripTimeline(tripId) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    return null;
  }

  const stops = await prisma.tripStop.findMany({
    where: { tripId },
    orderBy: { position: 'asc' },
    include: {
      city: true,
      activities: {
        include: { activity: true },
        orderBy: { position: 'asc' },
      },
    },
  });

  const days = [];
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  let currentDate = new Date(startDate);
  let dayNumber = 1;

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];

    const stopsForDay = stops.filter((stop) => {
      const stopStart = new Date(stop.startDate).toISOString().split('T')[0];
      const stopEnd = new Date(stop.endDate).toISOString().split('T')[0];
      return dateStr >= stopStart && dateStr <= stopEnd;
    });

    days.push({
      date: dateStr,
      dayNumber,
      stops: stopsForDay,
    });

    currentDate.setDate(currentDate.getDate() + 1);
    dayNumber += 1;
  }

  return {
    trip: {
      id: trip.id,
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
    },
    days,
  };
}

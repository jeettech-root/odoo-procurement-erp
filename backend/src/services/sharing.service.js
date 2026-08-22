import { randomUUID } from 'crypto';
import { prisma } from '../utils/prisma.js';

export function generateShareToken() {
  return randomUUID();
}

export async function getOrCreateShare(tripId) {
  let share = await prisma.tripShare.findUnique({
    where: { tripId },
  });

  if (!share) {
    share = await prisma.tripShare.create({
      data: {
        tripId,
        shareToken: generateShareToken(),
        isPublic: false,
      },
    });
  }

  return share;
}

export async function enableSharing(tripId) {
  let share = await getOrCreateShare(tripId);

  if (!share.isPublic) {
    share = await prisma.tripShare.update({
      where: { tripId },
      data: { isPublic: true },
    });
  }

  return share;
}

export async function disableSharing(tripId) {
  const share = await prisma.tripShare.findUnique({
    where: { tripId },
  });

  if (!share) {
    return null;
  }

  return prisma.tripShare.update({
    where: { tripId },
    data: { isPublic: false },
  });
}

export async function getShareByToken(shareToken) {
  return prisma.tripShare.findUnique({
    where: { shareToken },
    include: {
      trip: {
        include: {
          TripStop: {
            orderBy: { position: 'asc' },
            include: {
              city: true,
              activities: {
                include: { activity: true },
                orderBy: { position: 'asc' },
              },
            },
          },
        },
      },
    },
  });
}

export async function getShareStatus(tripId) {
  return prisma.tripShare.findUnique({
    where: { tripId },
  });
}

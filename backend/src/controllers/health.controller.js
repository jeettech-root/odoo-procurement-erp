import { prisma } from '../utils/prisma.js';

export const getHealth = async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      service: 'GlobeTrotter API',
      database: 'connected',
    });
  } catch (error) {
    res.status(200).json({
      status: 'ok',
      service: 'GlobeTrotter API',
      database: 'not-configured',
      message: 'Database connection is not configured yet.',
    });
  }
};

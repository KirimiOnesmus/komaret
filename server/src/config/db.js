
import { config } from './env.js';
import { logger } from './logger.js';

export let prisma = null;

export async function connectDatabase() {
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    await prisma.$connect();
    logger.info('Connected to MySQL via Prisma');
  } catch (err) {
    if (config.isProduction) throw err;
    logger.warn(`DB not connected (dev): ${err.message}`);
    logger.warn('Fix: start XAMPP MySQL, then run `npm install` and `npx prisma migrate dev`.');
  }
}

export async function disconnectDatabase() {
  if (prisma) await prisma.$disconnect();
}

export function getPrisma() {
  if (!prisma) throw new Error('Database not connected');
  return prisma;
}

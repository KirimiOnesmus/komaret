
import { connectDatabase, disconnectDatabase, prisma } from './config/db.js';
import { drainQueue } from './lib/notifications/worker.js';
import { logger } from './config/logger.js';

(async () => {
  await connectDatabase();
  if (!prisma) {
    logger.warn('Notification worker: no database connection — exiting.');
    process.exit(0);
  }
  try {
    await drainQueue();
  } catch (err) {
    logger.error('Notification worker error', err);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
})();

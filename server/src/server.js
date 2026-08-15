
import app from './app.js';
import { config } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { logger } from './config/logger.js';

async function start() {
  await connectDatabase();

  const server = app.listen(config.port, () => {
    logger.info(`API listening on :${config.port} (${config.env}) — base /api/v1`);
  });

  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  ['SIGTERM', 'SIGINT'].forEach((s) => process.on(s, () => shutdown(s)));

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection', err);
  });
}

start().catch((err) => {
  logger.error('Fatal boot error', err);
  process.exit(1);
});

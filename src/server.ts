import { app } from './app';
import { logger, logtail } from '@/libs/logger';
import { disconnectFromDatabase } from '@/database';
import config from '@/config';

(async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.error('Server crashed 😢 with error: ', err);
    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.warn('Server SHUTDOWN');
    await logtail.flush();
    process.exit(0);
  } catch (err) {
    logger.error('Error during server shutdown', err);
  }
};

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`).
 *
 * - `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process (e.g., pressing `Ctrl + C`).
 * - When either signal is received, `handleServerShutdown` is executed to ensure proper cleanup.
 */
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);

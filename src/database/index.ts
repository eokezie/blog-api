import mongoose from 'mongoose';

import { logger } from '@/libs/logger';
import config from '@/config';

type DBInput = {
  db: string | undefined;
};

export default ({ db }: DBInput) => {
  const connectToDatabase = () => {
    if (db) {
      mongoose
        .connect(db)
        .then(() => {
          logger.info('Connected to db successfully 🚀');
        })
        .catch((err: any) => {
          logger.error(`Error connecting to database : 😢`, err);
          return process.exit(1);
        });
    } else {
      logger.error('Could not read MONGODB URI from env 😢');
    }
  };

  connectToDatabase();

  mongoose.connection.on('disconnected', connectToDatabase);
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    logger.info('Disconnected from the database successfully.', {
      uri: config.MONGO_URI,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    logger.error('Error disconnecting from the database', err);
  }
};

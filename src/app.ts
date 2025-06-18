import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

import { corsOptions } from '@/libs/cors';
import config from '@/config';
import connectToDatabase from '@/database';
import v1Routes from '@/routes';
import limiter from '@/libs/express-rate-limit';

const db = config.MONGO_URI;

connectToDatabase({ db });

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
/** Only compress responses larger than 1KB */
app.use(
  compression({
    threshold: 1024,
  }),
);
/** Use Helmet to enhance security by setting various HTTP headers */
app.use(helmet());
/** Apply rate limiting middleware to prevent excessive requests and enhance security */
app.use(limiter);

app.use('/api/v1', v1Routes);

export { app };

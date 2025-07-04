'use strict';
import dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  MONGO_URI,
  LOG_LEVEL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  LOGTAIL_SOURCE_TOKEN,
  LOGTAIL_INGESTING_HOST,
  JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY,
} = process.env;

const env = NODE_ENV || 'development';

export default {
  env,
  PORT,
  NODE_ENV,
  MONGO_URI,
  LOG_LEVEL,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  LOGTAIL_SOURCE_TOKEN,
  LOGTAIL_INGESTING_HOST,
  WHITELIST_ADMINS_MAIL: ['okezieemeka949@gmail.com', 'staunch.dev@gmail.com'],
  WHITELIST_ORIGINS: ['http://localhost:4500'],
  JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY,
  defaultResLimit: 20,
  defaultResOffset: 0,
};

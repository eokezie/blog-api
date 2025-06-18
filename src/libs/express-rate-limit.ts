import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60000,
  limit: 60, // Allow a maximum of 60 requests per window per IP
  standardHeaders: 'draft-8', // Use the latest standard rate-limit headers
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again later.',
  },
});

export default limiter;

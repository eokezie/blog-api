import { Router } from 'express';

import authRoutes from '@/routes/auth.routes';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.blog-api.staunch.dev',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

export default router;

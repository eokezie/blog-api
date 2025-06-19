import { Router } from 'express';

import authRoutes from '@/routes/auth.routes';
import blogRoutes from '@/routes/blog.routes';
import userRoutes from '@/routes/user.routes';
import commentRoutes from '@/routes/comment.routes';
import likeRoutes from '@/routes/like.routes';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.blog-api.staunch.dev',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);

export default router;

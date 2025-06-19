import { Router } from 'express';

import {
  createCommentValidator,
  deleteCommentsValidator,
  getCommentsByBlogIdValidator,
} from '@/middlewares/validators/comment-validator';
import { authenticate } from '@/middlewares/authenticate';
import { validateRequest } from '@/middlewares/validate-request';
import authorize from '@/middlewares/authorize';
import commentBlog from '@/controllers/comment/comment-blog.controller';
import deleteComment from '@/controllers/comment/delete-comment.controller';
import getCommentByBlog from '@/controllers/comment/get-comments-by-blog.controller';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  createCommentValidator,
  validateRequest,
  commentBlog,
);
router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  getCommentsByBlogIdValidator,
  validateRequest,
  getCommentByBlog,
);

router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin', 'user']),
  deleteCommentsValidator,
  deleteComment,
);

export default router;

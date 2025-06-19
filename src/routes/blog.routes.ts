import { Router } from 'express';
import multer from 'multer';

import { authenticate } from '@/middlewares/authenticate';
import { validateRequest } from '@/middlewares/validate-request';
import {
  createBlogValidator,
  getAllBlogsValidator,
} from '@/middlewares/validators/blog-validator';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/upload-blog-banner';
import createBlog from '@/controllers/blog/create-blog';
import getAllBlogs from '@/controllers/blog/get-all-blogs';
import deleteBlog from '@/controllers/blog/delete-blog';

const upload = multer();
const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  createBlogValidator,
  validateRequest,
  uploadBlogBanner('post'),
  createBlog,
);
router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  getAllBlogsValidator,
  validateRequest,
  getAllBlogs,
);
router.delete('/:blogId', authenticate, authorize(['admin']), deleteBlog);

export default router;

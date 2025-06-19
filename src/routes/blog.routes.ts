import { Router } from 'express';
import multer from 'multer';

import { authenticate } from '@/middlewares/authenticate';
import { validateRequest } from '@/middlewares/validate-request';
import {
  createBlogValidator,
  getAllBlogsValidator,
  getBlockBySlugValidator,
  getBlockByUserValidator,
  updateBlogValidator,
} from '@/middlewares/validators/blog-validator';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/upload-blog-banner';
import createBlog from '@/controllers/blog/create-blog.controller';
import getAllBlogs from '@/controllers/blog/get-all-blogs.controller';
import deleteBlog from '@/controllers/blog/delete-blog.controller';
import getBlogBySlug from '@/controllers/blog/get-blog-by-slug.controller';
import getBlogsByUser from '@/controllers/blog/get-blogs-by-user.controller';
import updateBlog from '@/controllers/blog/update-blog.controller';

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
router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  getBlockByUserValidator,
  validateRequest,
  getBlogsByUser,
);
router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  getBlockBySlugValidator,
  validateRequest,
  getBlogBySlug,
);
router.put(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  updateBlogValidator,
  validateRequest,
  uploadBlogBanner('put'),
  updateBlog,
);
router.delete('/:blogId', authenticate, authorize(['admin']), deleteBlog);

export default router;

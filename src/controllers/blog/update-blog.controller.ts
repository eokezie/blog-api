import { NextFunction, Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

import { userRoleById } from '@/services/user.service';
import { BlogData } from './../../types/blog.types';
import { getBlogByIdForUpdate } from '@/services/blog.service';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';
import { logger } from '@/libs/logger';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (
  req: Request<{ blogId: string }, {}, BlogData, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { banner, content, status, title } = req.body;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const user = await userRoleById(userId!);
    const blog = await getBlogByIdForUpdate(blogId);

    if (!blog) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('Blog not found'));
      return;
    }

    if (blog?.author !== userId && user?.role !== 'admin') {
      res
        .status(httpStatus.FORBIDDEN)
        .json(errorResponse('Access denied, insufficient permissions'));

      logger.warn('A user tried to delete a blog without permission', {
        userId,
      });
      return;
    }

    if (title) blog.title = title;
    if (content) {
      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent;
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();
    logger.info('Blog updated', { blog });

    const responseMessage = 'Blog updated successfully';
    const responseData = blog;

    res
      .status(httpStatus.OK)
      .json(successResponse(responseMessage, responseData));
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error?.message || 'Internal Server Error!'));

    logger.error('Something went wrong:', error?.message);

    next(error);
  }
};

export default updateBlog;

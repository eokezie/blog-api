import type { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse } from '@/helpers/http-responses';
import { blogAuthorById, deleteSingleBlog } from '@/services/blog.service';
import { userRoleById } from '@/services/user.service';

const deleteBlog = async (
  req: Request<{ blogId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await blogAuthorById(blogId);
    const user = await userRoleById(userId!);

    if (!blog) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('Blog not found'));
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

    await cloudinary.uploader.destroy(blog?.banner.publicId!);
    logger.info('Blog banner deleted from Cloudinary', {
      publicId: blog?.banner.publicId,
    });

    await deleteSingleBlog(blogId);
    logger.info('Blog deleted successfully', {
      blogId,
    });

    res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error?.message || 'Internal Server Error!'));

    logger.error('Something went wrong:', error?.message);

    next(error);
  }
};

export default deleteBlog;

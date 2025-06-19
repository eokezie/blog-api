import { NextFunction, Request, Response } from 'express';

import { errorResponse, successResponse } from '@/helpers/http-responses';
import { httpStatus } from '@/libs/http-status';
import { logger } from '@/libs/logger';
import { findBlogBySlug } from '@/services/blog.service';
import { userRoleById } from '@/services/user.service';

const getBlogBySlug = async (
  req: Request<{ slug: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { slug } = req.params;
  const userId = req.userId;

  try {
    const user = await userRoleById(userId!);
    const blog = await findBlogBySlug(slug);

    if (!blog) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('Blog not found'));

      return;
    }

    if (user?.role === 'user' && blog.status === 'draft') {
      res
        .status(httpStatus.FORBIDDEN)
        .json(errorResponse('Access denied, insufficient permissions'));

      logger.warn('A user tried to access a draft blog', {
        userId,
        blog,
      });
      return;
    }

    logger.info('Blog fetched by slug', blog);

    const responseMessage = 'Blog created successfully';
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

export default getBlogBySlug;

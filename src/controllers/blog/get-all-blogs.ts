import type { NextFunction, Request, Response } from 'express';

import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';
import { userRoleById } from '@/services/user.service';
import { countBlog, findSpecificBlog } from '@/services/blog.service';
import config from '@/config';

interface QueryType {
  status?: 'draft' | 'published';
}

const getAllBlogs = async (
  req: Request<{}, {}, {}, { limit?: string; offset?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.userId;
  const limit = req.query.limit
    ? parseInt(req.query.limit, 10)
    : config.defaultResLimit;
  const offset =
    parseInt(req.query.offset as string) || config.defaultResOffset;

  try {
    const user = await userRoleById(userId!);
    const query: QueryType = {};

    if (user?.role === 'user') {
      query.status = 'published';
    }

    const total = await countBlog(query);
    const blogs = await findSpecificBlog(query, limit, offset);

    const responseMessage = 'Blogs fetched successfully';
    const responseData = {
      blogs,
      meta: {
        limit,
        offset,
        total,
      },
    };

    logger.error('Blogs fetched successfully by:', {
      user: userId,
    });

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

export default getAllBlogs;

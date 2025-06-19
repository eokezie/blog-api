import { NextFunction, Request, Response } from 'express';

import { userRoleById } from '@/services/user.service';
import {
  countBlogByUserIdAndBlogStatus,
  findBlogByUserIdandStatus,
} from '@/services/blog.service';
import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';
import config from '@/config';

interface QueryType {
  status?: 'draft' | 'published';
}

const getBlogsByUser = async (
  req: Request<{ userId: string }, {}, {}, { limit?: string; offset?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userId } = req.params;
  const currentUserId = req.userId;

  const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
  const offset =
    parseInt(req.query.offset as string) || config.defaultResOffset;

  try {
    const currentUser = await userRoleById(currentUserId!);
    const query: QueryType = {};

    if (currentUser?.role === 'user') {
      query.status = 'published';
    }

    const total = await countBlogByUserIdAndBlogStatus({
      author: userId,
      ...query,
    });
    const blogs = await findBlogByUserIdandStatus(
      {
        author: userId,
        ...query,
      },
      limit,
      offset,
    );

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

export default getBlogsByUser;

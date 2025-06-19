import { NextFunction, Request, Response } from 'express';

import { errorResponse, successResponse } from '@/helpers/http-responses';
import { httpStatus } from '@/libs/http-status';
import { logger } from '@/libs/logger';
import { getBlogByIdSelectId } from '@/services/blog.service';
import { getAllComments } from '@/services/comment.service';

const getCommentByBlog = async (
  req: Request<{ blogId: string }, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { blogId } = req.params;

  try {
    const blog = await getBlogByIdSelectId(blogId);

    if (!blog) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('Blog not found!'));
      return;
    }

    const allComments = await getAllComments(blogId);

    logger.info('Comments fetched successfully', {
      allComments,
    });

    const responseMessage = 'Comment fetched successfully';
    const responseData = allComments;
    res
      .status(httpStatus.CREATED)
      .json(successResponse(responseMessage, responseData));
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error?.message || 'Internal Server Error!'));

    logger.error('Something went wrong:', error?.message);

    next(error);
  }
};

export default getCommentByBlog;

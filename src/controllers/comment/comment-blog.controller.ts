import { NextFunction, Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

import { IComment } from '@/types/blog.types';
import { getBlogByIdSelectCommentCounts } from '@/services/blog.service';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';
import { createNewComment } from '@/services/comment.service';
import { logger } from '@/libs/logger';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentBlog = async (
  req: Request<{ blogId: string }, {}, IComment>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { content } = req.body;
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await getBlogByIdSelectCommentCounts(blogId);

    if (!blog) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('Blog not found'));
      return;
    }

    const cleanContent = purify.sanitize(content);

    const newComment = await createNewComment({
      blogId,
      content: cleanContent,
      userId,
    });
    logger.info('New comment create', newComment);

    blog.commentsCount++;
    await blog.save();

    logger.info('Blog comments count update', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
    });

    const responseMessage = 'Comment created successfully';
    const responseData = blog;
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

export default commentBlog;

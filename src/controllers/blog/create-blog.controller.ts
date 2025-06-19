import { NextFunction, Request, Response } from 'express';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

import { BlogData } from '@/types/blog.types';
import { creatNewBlog } from '@/services/blog.service';
import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';

/**
 *  Accepting HTML content from users (e.g., rich text inputs, comments, WYSIWYG editors).
	Wanting to sanitize it to prevent XSS (Cross-Site Scripting) attacks before rendering or storing it.
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (
  req: Request<{}, {}, BlogData>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { banner, content, status, title } = req.body;
  const userId = req.userId;

  const cleanContent = purify.sanitize(content);
  const blogObj = {
    title,
    content: cleanContent,
    banner,
    status,
    author: userId,
  };

  try {
    const newBlog = await creatNewBlog(blogObj);

    if (newBlog) {
      logger.info('New blog created', newBlog);

      const responseMessage = 'Blog created successfully';
      const responseData = newBlog;

      res
        .status(httpStatus.OK)
        .json(successResponse(responseMessage, responseData));
    }
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error?.message || 'Internal Server Error!'));

    logger.error('Something went wrong:', error?.message);

    next(error);
  }
};

export default createBlog;

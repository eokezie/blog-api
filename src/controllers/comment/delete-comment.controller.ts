import { NextFunction, Request, Response } from 'express';

import { errorResponse } from '@/helpers/http-responses';
import { httpStatus } from '@/libs/http-status';
import { logger } from '@/libs/logger';
import { getBlogByIdSelectCommentCounts } from '@/services/blog.service';
import {
  deleteSingleComment,
  getCommentByID,
} from '@/services/comment.service';
import { userRoleById } from '@/services/user.service';

const deleteComment = async (
  req: Request<{ commentId: string }, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { commentId } = req.params;
  const currentUserId = req.userId;

  try {
    const comment = await getCommentByID(commentId);
    const user = await userRoleById(currentUserId!);

    if (!comment) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('Comment not found'));
      return;
    }

    const blog = await getBlogByIdSelectCommentCounts(comment.blogId);
    if (!blog) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('Blog not found'));
      return;
    }

    if (comment.userId !== currentUserId && user?.role !== 'admin') {
      res
        .status(httpStatus.FORBIDDEN)
        .json(errorResponse('Access denied, insufficient permission'));

      logger.warn('A user tried to delete a comment without permission', {
        userId: currentUserId,
        comment,
      });
      return;
    }

    await deleteSingleComment({ _id: commentId });
    logger.info('Comment deleted successfully', {
      commentId,
    });

    blog.commentsCount--;
    await blog.save();

    logger.info('Blog comments count updated', {
      blogId: blog._id,
      commentsCount: blog.commentsCount,
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

export default deleteComment;

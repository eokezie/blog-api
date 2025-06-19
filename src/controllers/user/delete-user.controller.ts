import { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

import { blogsByAuthor, deleteManyBlogs } from '@/services/blog.service';
import { logger } from '@/libs/logger';
import { deleteSingleUser } from '@/services/user.service';
import { httpStatus } from '@/libs/http-status';
import { errorResponse } from '@/helpers/http-responses';

const deleteUser = async (
  req: Request<{ userId: string }, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userId } = req.params;

  try {
    const blogs = await blogsByAuthor({ author: userId });

    const publicIds = blogs.map(({ banner }) => banner.publicId);
    await cloudinary.api.delete_resources(publicIds);

    logger.info('Multiple blog banners deleted from Cloudinary', {
      publicIds,
    });

    await deleteManyBlogs({ author: userId });
    logger.info('Multiple blogs deleted', {
      userId,
      blogs,
    });

    await deleteSingleUser({ _id: userId });
    logger.info('A user account has been deleted', {
      userId,
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

export default deleteUser;

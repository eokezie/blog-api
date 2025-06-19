import { NextFunction, Request, Response } from 'express';

import { getUserCount, getUsers } from '@/services/user.service';
import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';
import config from '@/config';

const getAllUsers = async (
  req: Request<{}, {}, {}, { limit: string; offset: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
  const offset =
    parseInt(req.query.offset as string) || config.defaultResOffset;

  try {
    const totalUsers = await getUserCount();
    const allUsers = await getUsers(limit, offset);

    const responseMessage = 'Users fetched successfully';
    const responseData = {
      allUsers,
      meta: {
        limit,
        offset,
        total: totalUsers,
      },
    };

    logger.info('Users fetched successfully');

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

export default getAllUsers;

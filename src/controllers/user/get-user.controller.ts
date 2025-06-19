import { NextFunction, Request, Response } from 'express';

import { errorResponse, successResponse } from '@/helpers/http-responses';
import { httpStatus } from '@/libs/http-status';
import { logger } from '@/libs/logger';
import { getUserById } from '@/services/user.service';

const getSingleUser = async (
  req: Request<{ userId: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId!);

    if (!user) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('User not found'));

      return;
    }

    const responseMessage = 'User fetched successfully';
    const responseData = {
      user,
    };

    logger.error('User fetched successfully');
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

export default getSingleUser;

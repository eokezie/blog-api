import { NextFunction, Request, Response } from 'express';

import { deleteToken } from '@/services/auth/register.service';
import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse } from '@/helpers/http-responses';
import config from '@/config';

interface CustomRequest extends Request {
  cookies: {
    refreshToken?: string;
    [key: string]: any;
  };
}

const logOutUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    if (refreshToken) {
      await deleteToken(refreshToken);

      logger.info('User refresh token deleted successfully', {
        userId: req.userId,
      });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    logger.info('User logged out successfully', {
      userId: req.userId,
    });

    res.sendStatus(204);
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error?.message || 'Internal Server Error!'));

    logger.error('Error during logout', error?.message);
    next(error);
  }
};

export default logOutUser;

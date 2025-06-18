import { Types } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

import { errorResponse, successResponse } from '@/helpers/http-responses';
import { httpStatus } from '@/libs/http-status';
import { generateAccessToken, verifyRefreshToken } from '@/libs/jwt-module';
import { tokenExists } from '@/services/auth/register.service';
import { logger } from '@/libs/logger';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

interface CustomRequest extends Request {
  cookies: {
    refreshToken?: string;
    [key: string]: any;
  };
}

const refreshUserToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const userToken = await tokenExists(refreshToken);
    if (!userToken) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json(errorResponse('Invalid refresh token!'));

      return;
    }

    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accessToken = generateAccessToken(jwtPayload.userId);
    const responseMessage = 'Token refreshed successfully';
    const responseData = {
      accessToken,
    };

    res
      .status(httpStatus.OK)
      .json(successResponse(responseMessage, responseData));
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json(errorResponse('Refresh token expired, please login again!'));

      return;
    }

    if (error instanceof JsonWebTokenError) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json(errorResponse('Invalid refresh token!'));

      return;
    }

    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error?.message || 'Internal Server Error!'));

    logger.error('Something went wrong:', error?.message);
    next(error);
  }
};

export default refreshUserToken;

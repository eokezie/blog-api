import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import { verifyAccessToken } from '@/libs/jwt-module';
import { parseTokenFromAuthorizationHeader } from '@/libs/jwt-module';
import { httpStatus } from '@/libs/http-status';
import { errorResponse } from '@/helpers/http-responses';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = parseTokenFromAuthorizationHeader(req);

  if (!token) {
    res
      .status(httpStatus.FORBIDDEN)
      .json(
        errorResponse(
          'Bearer token not provided as expected in authorization header',
        ),
      );

    return;
  }

  const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

  if (!jwtPayload || !jwtPayload.userId) {
    res
      .status(httpStatus.FORBIDDEN)
      .json(errorResponse('Bearer token failed verification'));

    return;
  }

  req.userId = jwtPayload.userId;

  next();
};

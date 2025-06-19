import type { Request, Response, NextFunction } from 'express';

import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse } from '@/helpers/http-responses';
import User from '@/models/user.model';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();

      if (!user) {
        res.status(httpStatus.NOT_FOUND).json(errorResponse('User not found'));

        return;
      }

      if (!roles.includes(user.role)) {
        res
          .status(httpStatus.FORBIDDEN)
          .json(errorResponse('Access denied, insufficient permissions'));

        return;
      }

      return next();
    } catch (err) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(errorResponse('Internal server error'));

      logger.error('Error while authorizing user', err);
    }
  };
};

export default authorize;

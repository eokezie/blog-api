import { NextFunction, Request, Response } from 'express';

import { Password } from '@/libs/password';
import { UserData } from '@/enums/auth.enums';
import { generateAccessToken, generateRefreshToken } from '@/libs/jwt-module';
import { createToken, createUser } from '@/services/auth/register.service';
import { logger } from '@/libs/logger';
import { genUsername } from '@/utils';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';
import config from '@/config';

const registerUser = async (
  req: Request<{}, {}, UserData>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password, role } = req.body;

  if (!email) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('Email field is required!'));

    return;
  }

  if (!password) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('Password field is required!'));
    return;
  }

  if (!role) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('Role field is required!'));

    return;
  }

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json(errorResponse('You cannot register as an admin'));

    logger.warn(
      `User with email ${email} tried to register as an admin but is not in the whitelist`,
    );

    return;
  }

  try {
    const username = genUsername();
    const hashedPassword = await Password.toHash(password);

    const newUserObj = {
      username,
      password: hashedPassword,
      email,
      role,
    };

    const newUser = await createUser(newUserObj);

    if (newUser) {
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);

      const tokenObj = {
        token: refreshToken,
        userId: newUser._id,
      };

      await createToken(tokenObj);

      logger.info('Refresh token created for user', {
        userId: newUser._id,
        token: refreshToken,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      logger.info('User registered successfully', {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      });

      const responseMessage = 'User was registered successfully';
      const responseData = {
        user: {
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
      };

      res
        .status(httpStatus.OK)
        .json(successResponse(responseMessage, responseData));
    }
  } catch (error: any) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse(error?.message || 'Internal Server Error!'));

    logger.error('Error during user registration', error?.message);

    next(error);
  }
};

export default registerUser;

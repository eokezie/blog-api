import { NextFunction, Request, Response } from 'express';

import { errorResponse, successResponse } from '@/helpers/http-responses';
import { httpStatus } from '@/libs/http-status';
import { logger } from '@/libs/logger';
import { createToken, findUser } from '@/services/auth/register.service';
import { Password } from '@/libs/password';
import { generateAccessToken, generateRefreshToken } from '@/libs/jwt-module';
import config from '@/config';

interface ILoginRequestBody {
  email: string;
  password: string;
}

const loginUser = async (
  req: Request<{}, {}, ILoginRequestBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;

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

  try {
    const user = await findUser(email);

    if (!user) {
      logger.error(
        `Login Failed: No user exists with this email addres -: ${email}`,
      );
      res
        .status(httpStatus.BAD_REQUEST)
        .json(errorResponse('Invalid email or password provided!'));
      return;
    }

    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(errorResponse('Invalid email or password provided!'));

      return;
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const tokenObj = {
      token: refreshToken,
      userId: user._id,
    };

    await createToken(tokenObj);

    logger.info('Refresh token created for user', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    logger.info('User logged in successfully', {
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const responseMessage = 'User was authenticated successfully';
    const responseData = {
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    };

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

export default loginUser;

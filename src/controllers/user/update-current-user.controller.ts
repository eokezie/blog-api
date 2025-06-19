import { NextFunction, Request, Response } from 'express';

import { IUpdateUser } from '@/types/user.types';
import { getUserByIdWithPasswordField } from '@/services/user.service';
import { httpStatus } from '@/libs/http-status';
import { errorResponse, successResponse } from '@/helpers/http-responses';
import { Password } from '@/libs/password';
import { logger } from '@/libs/logger';

const updateCurrentUser = async (
  req: Request<{}, {}, IUpdateUser, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    website,
    facebook,
    instagram,
    linkedin,
    x,
    youtube,
  } = req.body;
  const userId = req.userId;

  try {
    const user = await getUserByIdWithPasswordField(userId!);
    if (!user) {
      res.status(httpStatus.NOT_FOUND).json(errorResponse('User not found'));
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await Password.toHash(password!);
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;
    if (!user.socialLinks) {
      user.socialLinks = {};
    }
    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (linkedin) user.socialLinks.linkedin = linkedin;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();
    logger.info('User updated successfully', user);

    const responseMessage = 'User updated successfully';
    const responseData = {
      user,
    };

    logger.error('User updated successfully');
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

export default updateCurrentUser;

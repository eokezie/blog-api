import type { Request, Response, NextFunction } from 'express';
import type { UploadApiErrorResponse } from 'cloudinary';

import { logger } from '@/libs/logger';
import { httpStatus } from '@/libs/http-status';
import { errorResponse } from '@/helpers/http-responses';
import { blogById } from '@/services/blog.service';
import uploadToCloudinary from '@/libs/cloudinary';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const uploadBlogBanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      res
        .status(httpStatus.BAD_REQUEST)
        .json(errorResponse('Blog banner is required'));

      return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
      res
        .status(httpStatus.LARGE_PAYLOAD)
        .json(errorResponse('File size must be less than 2MB'));

      return;
    }

    try {
      const { blogId } = req.params;
      const blog = await blogById(blogId);

      const data = await uploadToCloudinary(
        req.file.buffer,
        blog?.banner.publicId.replace('blog-api/', ''),
      );

      if (!data) {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json(errorResponse('Internal server error'));

        logger.error('Error while uploading blog banner to cloudinary', {
          blogId,
          publicId: blog?.banner.publicId,
        });
        return;
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info('Blog banner uploaded to Cloudinary', {
        blogId,
        banner: newBanner,
      });

      req.body.banner = newBanner;

      next();
    } catch (error: UploadApiErrorResponse | any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(errorResponse(error?.message));

      logger.error('Error while uploading blog banner to Cloudinary', error);
    }
  };
};

export default uploadBlogBanner;

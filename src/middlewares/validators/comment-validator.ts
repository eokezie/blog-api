import { body, param } from 'express-validator';

export const createCommentValidator = [
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

export const getCommentsByBlogIdValidator = [
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
];

export const deleteCommentsValidator = [
  param('commentId').isMongoId().withMessage('Invalid comment ID'),
];

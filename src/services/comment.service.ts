import { Types } from 'mongoose';
import { IComment } from '@/types/blog.types';
import Comment from '@/models/comment.model';

type CommentData = {
  blogId: string;
  content: string;
  userId: Types.ObjectId | undefined;
};
export const createNewComment = async (commentObj: CommentData) => {
  return await Comment.create(commentObj);
};

export const getCommentByID = async (commentId: string) => {
  return await Comment.findById(commentId)
    .select('userId blogId')
    .lean()
    .exec();
};

export const deleteSingleComment = async (query: any) => {
  return await Comment.deleteOne(query);
};

export const getAllComments = async (blogId: string) => {
  return await Comment.find({ blogId }).sort({ createdAt: -1 }).lean().exec();
};

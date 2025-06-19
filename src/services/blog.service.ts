import { Types } from 'mongoose';
import { BlogData } from '@/types/blog.types';
import Blog from '@/models/blog.model';

export const creatNewBlog = async (userObj: BlogData) => {
  return await Blog.create(userObj);
};

export const blogById = async (blogId: string) => {
  return await Blog.findById(blogId).select('banner.publicId').exec();
};

export const blogsByAuthor = async (query: any) => {
  return await Blog.find(query).select('banner.publicId').lean().exec();
};

export const blogAuthorById = async (blogId: string) => {
  return await Blog.findById(blogId)
    .select('author banner.publicId')
    .lean()
    .exec();
};

export const deleteSingleBlog = async (blogId: string) => {
  return await Blog.deleteOne({ _id: blogId });
};

export const deleteManyBlogs = async (query: any) => {
  return await Blog.deleteMany(query);
};

export const countBlog = async (query: any) => {
  return await Blog.countDocuments(query);
};

export const countBlogByUserIdAndBlogStatus = async (query: any) => {
  return await Blog.countDocuments(query);
};

export const findBlogByUserIdandStatus = async (
  query: any,
  limit: number,
  offset: number,
) => {
  return await Blog.find(query)
    .select('-banner.publicId -__v')
    .populate('author', '-createdAt -updatedAt -__v')
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 })
    .lean()
    .exec();
};

export const findSpecificBlog = async (
  query: any,
  limit: number,
  offset: number,
) => {
  return await Blog.find(query)
    .select('-banner.publicId -__v')
    .populate('author', '-createdAt -updatedAt -__v')
    .limit(limit)
    .skip(offset)
    .sort({ createdAt: -1 })
    .lean()
    .exec();
};

export const findBlogBySlug = async (slug: string) => {
  return await Blog.findOne({ slug })
    .select('-banner.publicId -__v')
    .populate('author', '-createdAt -updatedAt -__v')
    .lean()
    .exec();
};

export const getBlogByIdForUpdate = async (blogId: string) => {
  return await Blog.findById(blogId).select('-__v').exec();
};

export const getBlogByIdSelectCommentCounts = async (
  blogId: string | Types.ObjectId,
) => {
  return await Blog.findById(blogId).select('_id commentsCount').exec();
};

export const getBlogByIdSelectId = async (blogId: string) => {
  return await Blog.findById(blogId).select('_id').lean().exec();
};

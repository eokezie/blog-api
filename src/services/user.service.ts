import { Types } from 'mongoose';
import User from '@/models/user.model';

export const userRoleById = async (userId: string | Types.ObjectId) => {
  return await User.findById(userId).select('role').lean().exec();
};

export const getUserById = async (userId: string | Types.ObjectId) => {
  return await User.findById(userId).select('-__v').lean().exec();
};

export const getUserByIdWithPasswordField = async (
  userId: string | Types.ObjectId,
) => {
  return await User.findById(userId).select('+password -__v').exec();
};

export const deleteSingleUser = async (query: any) => {
  return await User.deleteOne(query);
};

export const getUserCount = async () => {
  return await User.countDocuments();
};

export const getUsers = async (limit: number, offset: number) => {
  return await User.find()
    .select('-__v')
    .limit(limit)
    .skip(offset)
    .lean()
    .exec();
};

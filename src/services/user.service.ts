import { Types } from 'mongoose';
import User from '@/models/user.model';

export const userRoleById = async (userId: string | Types.ObjectId) => {
  return await User.findById(userId).select('role').lean().exec();
};

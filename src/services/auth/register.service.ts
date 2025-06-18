import { IUser } from '@/types/user.types';
import { IToken } from '@/types/token.types';
import User from '@/models/user.model';
import Token from '@/models/token.model';

export const createUser = async (userObj: IUser) => {
  return await User.create(userObj);
};

export const createToken = async (tokenObj: IToken) => {
  return await Token.create(tokenObj);
};

export const tokenExists = async (token: string) => {
  return await Token.exists({ token: token });
};

export const deleteToken = async (token: string) => {
  return await Token.deleteOne({ token: token });
};

export const findUser = async (email: string) => {
  return await User.findOne({ email })
    .select('username email password role')
    .lean()
    .exec();
};

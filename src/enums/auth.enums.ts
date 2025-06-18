import { IUser } from '@/types/user.types';

export type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

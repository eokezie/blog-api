export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

export interface IUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
}

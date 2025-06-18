import { Types } from 'mongoose';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

import config from '@/config';

const generateAccessToken = (userId: Types.ObjectId): string => {
  const signingOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: config.ACCESS_TOKEN_EXPIRY as any,
    subject: 'accessApi',
  };

  return jwt.sign({ userId }, config.JWT_PRIVATE_KEY!, signingOptions);
};

const generateRefreshToken = (userId: Types.ObjectId): string => {
  const signingOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: config.REFRESH_TOKEN_EXPIRY as any,
    subject: 'refreshToken',
  };

  return jwt.sign({ userId }, config.JWT_PRIVATE_KEY!, signingOptions);
};

const verifyAccessToken = (token: string): any => {
  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
  };

  try {
    return jwt.verify(token, config.JWT_PUBLIC_KEY! as string, verifyOptions);
  } catch (err) {
    return null;
  }
};

const verifyRefreshToken = (token: string): any => {
  const verifyOptions: VerifyOptions = {
    algorithms: ['RS256'],
  };

  try {
    return jwt.verify(token, config.JWT_PUBLIC_KEY! as string, verifyOptions);
  } catch (err) {
    return null;
  }
};

const decode = (token: any) => {
  return jwt.decode(token, { complete: true });
};

function parseTokenFromAuthorizationHeader(req: any) {
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader || !authorizationHeader.includes('Bearer ')) {
    return null;
  }
  return req.headers['authorization'].split(' ')[1];
}

export {
  decode,
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  parseTokenFromAuthorizationHeader,
};

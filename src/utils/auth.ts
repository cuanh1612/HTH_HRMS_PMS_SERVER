import { User } from '../entities/User';
import { sign, Secret } from 'jsonwebtoken';
import { Response } from 'express';

export const createToken = (type: 'accessToken' | 'refreshToken', user: User) =>
  sign(
    {
      userId: user.id,
      ...(type === 'refreshToken' ? { tokenVersion: user.tokenVersion } : {}),
    },
    type === 'accessToken'
      ? (process.env.ACCESS_TOKEN_SECRET as Secret)
      : (process.env.REFRESH_TOKEN_SECRET as Secret),
    {
      expiresIn: type === 'accessToken' ? '15s' : '60m',
    }
  );

export const sendRefreshToken = (res: Response, user: User) => {
  res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, createToken('refreshToken', user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/api/auth/refresh_token',
  });
};

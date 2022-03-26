import argon2 from 'argon2';
import { Request, Response } from 'express';
import { User } from '../entities/User';
import { createToken, sendRefreshToken } from '../utils/auth';
import handleCatchError from '../utils/catchAsyncError';
import { Secret, verify } from 'jsonwebtoken';
import { UserAuthPayload } from '../type/UserAuthPayload';

const authController = {
  register: handleCatchError(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser)
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Duplicated email',
      });

    const hashedPassword = await argon2.hash(password);

    const newUser = User.create({
      email,
      password: hashedPassword,
      username,
    });

    const createdUser = await newUser.save();

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'User registration successfully',
      user: createdUser,
    });
  }),

  login: handleCatchError(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!existingUser)
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Incorrect email or password',
      });

    const isPasswordValid = await argon2.verify(existingUser.password, password);

    if (!isPasswordValid)
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Incorrect email or password',
      });

    //Save cookie refresh token
    sendRefreshToken(res, existingUser);

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Logged in successfully',
      user: existingUser,
      accessToken: createToken('accessToken', existingUser),
    });
  }),

  refreshToken: handleCatchError(async (req: Request, res: Response) => {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];

    if (!refreshToken)
      return res.status(401).json({
        code: 401,
        success: false,
        message: 'You must login first',
      });

    //Check decode
    try {
      const decodeUser = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as Secret
      ) as UserAuthPayload;

      console.log(decodeUser);

      const existingUser = await User.findOne({
        where: {
          id: decodeUser.userId,
        },
      });

      if (!existingUser || existingUser.tokenVersion !== decodeUser.tokenVersion)
        return res.status(401).json({
          code: 401,
          success: false,
          message: 'You must login first',
        });

      sendRefreshToken(res, existingUser);

      return res.status(200).json({
        code: 200,
        success: true,
        message: 'Refresh token success',
        accessToken: createToken('accessToken', existingUser),
      });
    } catch (error) {
      return res.status(403).json({
        code: 403,
        success: false,
        message: 'You must login first',
      });
    }
  }),

  logout: handleCatchError(async (req: Request, res: Response) => {
    console.log('co ne ');

    const { userId } = req.body;

    const existingUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!existingUser)
      return res.status(400).json({
        code: 400,
        success: false,
        message: 'Logout false',
      });

    existingUser.tokenVersion += 1;

    await existingUser.save();

    res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/api/auth/refresh_token',
    });

    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Logout successfully',
    });
  }),
};

export default authController;

import { Request, Response } from 'express';
import { User } from '../entities/User';
import handleCatchError from '../utils/catchAsyncError';

const userController = {
  getAll: handleCatchError(async (_: Request, res: Response) => {
    return res.status(200).json({
      code: 200,
      success: true,
      message: 'Get all users successfully',
      users: await User.find(),
    });
  }),
};

export default userController;

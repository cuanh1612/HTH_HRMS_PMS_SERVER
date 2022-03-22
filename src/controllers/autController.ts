import { Request, Response } from 'express';
import { User } from '../entities/User';

const authController = {
  Hello: async (_: Request, res: Response) => {
    const users = await User.find();
    console.log(users);

    return res.json({
      users,
    });
  },
};

export default authController;

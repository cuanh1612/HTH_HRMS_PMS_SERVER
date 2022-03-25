import express from 'express';
import userController from '../controllers/userController';
import { checkAuth } from '../utils/middleware/checkAuth';
const userRouter = express.Router();

userRouter.get('/', checkAuth([]), userController.getAll);

export default userRouter;

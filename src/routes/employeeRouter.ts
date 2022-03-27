import express from 'express';
import employeeController from '../controllers/employeeController';

const userRouter = express.Router();

userRouter.post('/', employeeController.create);

export default userRouter;

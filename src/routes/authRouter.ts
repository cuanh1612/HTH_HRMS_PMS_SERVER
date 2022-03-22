import express from 'express';
import authController from '../controllers/autController';
const authRouter = express.Router();

authRouter.get('/', authController.Hello);

export default authRouter;

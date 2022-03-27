import express from 'express';
import authController from '../controllers/authController';

const authRouter = express.Router();

authRouter.post('/login', authController.login);

authRouter.get('/refresh_token', authController.refreshToken);

authRouter.post('/logout', authController.logout);

export default authRouter;

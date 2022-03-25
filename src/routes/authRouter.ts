import express from 'express';
import authController from '../controllers/authController';
import { checkAuth } from '../utils/middleware/checkAuth';
const authRouter = express.Router();

authRouter.post('/register', checkAuth(['admin']), authController.register);

authRouter.post('/login', authController.login);

authRouter.get('/refresh_token', authController.refreshToken);

export default authRouter;

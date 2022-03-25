import * as core from 'express-serve-static-core';
import authRouter from './authRouter';
import userRouter from './userRouter';

const mainRouter = (app: core.Express) => {
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
};

export default mainRouter;

import * as core from 'express-serve-static-core';
import authRouter from './authRouter';

const mainRouter = (app: core.Express) => {
  app.use('/api/auth', authRouter);
};

export default mainRouter;

import * as core from 'express-serve-static-core';
import authRouter from './authRouter';
import employeeRouter from './employeeRouter';

const mainRouter = (app: core.Express) => {
  app.use('/api/auth', authRouter);

  app.use('/api/employees', employeeRouter);
};

export default mainRouter;

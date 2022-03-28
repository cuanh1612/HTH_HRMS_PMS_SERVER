import * as core from 'express-serve-static-core';
import authRouter from './authRouter';
import employeeRouter from './employeeRouter';
import leaveRouter from './leaveRouter';
import leaveTypeRouter from './leaveTypeRouter';

const mainRouter = (app: core.Express) => {
	app.use('/api/auth', authRouter)

  app.use('/api/employees', employeeRouter);

  app.use('/api/leaves', leaveRouter);

  app.use('/api/leave_types', leaveTypeRouter);
};

export default mainRouter

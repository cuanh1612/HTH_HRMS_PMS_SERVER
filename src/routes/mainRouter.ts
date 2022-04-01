import * as core from 'express-serve-static-core'
import authRouter from './authRouter'
import employeeRouter from './employeeRouter'
import departmentRouter from './departmentRouter'
import designationRouter from './designationRouter'
import leaveTypeRouter from './leaveTypeRouter'


const mainRouter = (app: core.Express) => {
	app.use('/api/auth', authRouter)

	app.use('/api/employees', employeeRouter)

	app.use('/api/departments', departmentRouter)

	app.use('/api/designations', designationRouter)

	app.use('/api/leave-types', leaveTypeRouter)
}

export default mainRouter

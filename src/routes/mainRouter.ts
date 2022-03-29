import * as core from 'express-serve-static-core'
import authRouter from './authRouter'
import employeeRouter from './employeeRouter'
import departmentRouter from './departmentRouter'

const mainRouter = (app: core.Express) => {
	app.use('/api/auth', authRouter)

	app.use('/api/employees', employeeRouter)

	app.use('/api/department', departmentRouter)
}

export default mainRouter

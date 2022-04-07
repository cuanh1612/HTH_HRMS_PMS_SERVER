import * as core from 'express-serve-static-core'
import authRouter from './authRouter'
import employeeRouter from './employeeRouter'
import departmentRouter from './departmentRouter'
import designationRouter from './designationRouter'
import leaveTypeRouter from './leaveTypeRouter'
import leaveRouter from './leaveRouter'
import clientRouter from './clientRouter'
import clientCategoryRouter from './clientCategoryRouter'
import clientSubCategoryRouter from './clientSubCategoryRouter'
<<<<<<< HEAD
import holidayRouter from './holidayRouter'
=======
import contractRouter from './contractRouter'
>>>>>>> a81939a2f718a8296a4e2fd3da573f1347b4c1d3

const mainRouter = (app: core.Express) => {
	app.use('/api/auth', authRouter)

	app.use('/api/employees', employeeRouter)

	app.use('/api/departments', departmentRouter)

	app.use('/api/designations', designationRouter)

	app.use('/api/leave-types', leaveTypeRouter)

	app.use('/api/leaves', leaveRouter)

	app.use('/api/clients', clientRouter)

	app.use('/api/holidays', holidayRouter)

	app.use('/api/client-categories', clientCategoryRouter)

	app.use('/api/client-sub-categories', clientSubCategoryRouter)

	app.use('/api/contracts', contractRouter)
}

export default mainRouter

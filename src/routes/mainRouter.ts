import * as core from 'express-serve-static-core'
import attendanceRouter from './attendanceRouter'
import authRouter from './authRouter'
import clientCategoryRouter from './clientCategoryRouter'
import clientRouter from './clientRouter'
import clientSubCategoryRouter from './clientSubCategoryRouter'
import contractFileRouter from './contractFileRouter'
import contractRouter from './contractRouter'
import contractTypeRouter from './contractTypeRouter'
import conversationReplyRouter from './conversationReplyRouter'
import conversationRouter from './conversationRouter'
import departmentRouter from './departmentRouter'
import designationRouter from './designationRouter'
import discussionRouter from './discussionRouter'
import employeeRouter from './employeeRouter'
import holidayRouter from './holidayRouter'
import leaveRouter from './leaveRouter'
import leaveTypeRouter from './leaveTypeRouter'
import signRouter from './signRouter'

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

	app.use('/api/contract-types', contractTypeRouter)

	app.use('/api/attendances', attendanceRouter)

	app.use('/api/signs', signRouter)

	app.use('/api/conversations', conversationRouter)

	app.use('/api/conversation-replies', conversationReplyRouter)

	app.use('/api/discussions', discussionRouter)

	app.use('/api/contract-files', contractFileRouter)
}

export default mainRouter

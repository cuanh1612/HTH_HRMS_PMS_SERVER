import express from 'express'
import employeeController from '../controllers/employee.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const userRouter = express.Router()

userRouter.post('/', checkAuth(['Admin']), employeeController.create)
userRouter.post('/delete-many', checkAuth(['Admin']), employeeController.deleteMany)

userRouter.put('/role', checkAuth(['Admin']), employeeController.changeRole)
userRouter.put('/:employeeId', checkAuth(['Admin']), employeeController.update)

userRouter.get('/normal', employeeController.getNormal)
userRouter.get('/', checkAuth([]), employeeController.getAll)
userRouter.get('/:employeeId', checkAuth([]), employeeController.getDetail)
userRouter.get(
	'/:employeeId/open-tasks',
	checkAuth(['Admin', 'Employee']),
	employeeController.getOpenTasks
)
userRouter.get(
	'/:employeeId/hours-logged',
	checkAuth(['Admin', 'Employee']),
	employeeController.getHoursLogged
)
userRouter.get(
	'/:employeeId/count-projects',
	checkAuth(['Admin', 'Employee']),
	employeeController.getCountProjects
)
userRouter.get(
	'/:employeeId/late-attendance',
	checkAuth(['Admin', 'Employee']),
	employeeController.getLateAttendance
)
userRouter.get(
	'/:employeeId/count-leaves-taken',
	checkAuth(['Admin', 'Employee']),
	employeeController.countLeavesTaken
)
userRouter.get(
	'/:employeeId/count-tasks-status',
	checkAuth(['Admin', 'Employee']),
	employeeController.countTasksStatus
)
userRouter.get('/:employeeId/tasks', checkAuth(['Admin', 'Employee']), employeeController.getTasks)
userRouter.get(
	'/:employeeId/count-status-projects',
	checkAuth(['Admin', 'Employee']),
	employeeController.CountStatusProjects
)
userRouter.get(
	'/:employeeId/count-pending-tasks',
	checkAuth(['Admin', 'Employee']),
	employeeController.getCountPendingTasks
)
userRouter.get(
	'/:employeeId/count-complete-tasks',
	checkAuth(['Admin', 'Employee']),
	employeeController.getCountCompleteTasks
)
userRouter.post('/csv', checkAuth(['Admin']), employeeController.importCSV)
userRouter.delete('/:employeeId', checkAuth(['Admin']), employeeController.delete)

export default userRouter

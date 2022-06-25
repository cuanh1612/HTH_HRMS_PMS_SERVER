import express from 'express'
import timeLogController from '../controllers/timeLogController'
import { checkAuth } from '../utils/middleware/checkAuth'

const TimeLogRouter = express.Router()

TimeLogRouter.post('/delete-many', checkAuth([]), timeLogController.Deletemany)

TimeLogRouter.get('/calendar', timeLogController.calendar)

TimeLogRouter.get('/calendar-employee/:employeeId', timeLogController.calendarByEmployee)

TimeLogRouter.post('/', checkAuth([]), timeLogController.create)

TimeLogRouter.get('/current-user', timeLogController.getByCurrentUser)

TimeLogRouter.get('/by-project/:projectId', timeLogController.getAllByProject)

TimeLogRouter.get('/:timelogId', timeLogController.getDetail)

TimeLogRouter.get('/', timeLogController.getAll)

TimeLogRouter.delete('/:timeLogId', checkAuth([]), timeLogController.delete)

TimeLogRouter.put('/:timeLogId', checkAuth([]), timeLogController.update)

export default TimeLogRouter

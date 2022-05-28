import express from 'express'
import timeLogController from '../controllers/timeLogController'

const TimeLogRouter = express.Router()

TimeLogRouter.post('/delete-many', timeLogController.Deletemany)

TimeLogRouter.get('/calendar', timeLogController.calendar)

TimeLogRouter.post('/', timeLogController.create)

TimeLogRouter.get('/by-project/:projectId', timeLogController.getAllByProject)

TimeLogRouter.get('/:timelogId', timeLogController.getDetail)

TimeLogRouter.get('/', timeLogController.getAll)

TimeLogRouter.delete('/:timeLogId', timeLogController.delete)

TimeLogRouter.put('/:timeLogId', timeLogController.update)

export default TimeLogRouter

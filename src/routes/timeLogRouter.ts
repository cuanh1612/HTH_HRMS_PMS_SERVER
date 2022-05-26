import express from 'express'
import timeLogController from '../controllers/timeLogController'

const TimeLogRouter = express.Router()

TimeLogRouter.post('/', timeLogController.create)

TimeLogRouter.get('/', timeLogController.getAll)
TimeLogRouter.get('/:timelogId', timeLogController.getDetail)

TimeLogRouter.delete('/:id', timeLogController.delete)



export default TimeLogRouter

import express from 'express'
import timeLogController from '../controllers/timeLogController'
import { checkAuth } from '../utils/middleware/checkAuth'

const TimeLogRouter = express.Router()

TimeLogRouter.post('/', checkAuth(['Admin']), timeLogController.create)

export default TimeLogRouter

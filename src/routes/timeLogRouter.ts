import express from 'express'
import timeLogController from '../controllers/timeLogController'

const TimeLogRouter = express.Router()

TimeLogRouter.post('/', timeLogController.create)


export default TimeLogRouter

import express from 'express'
import taskFileController from '../controllers/taskFile.controller'
import { checkAuth } from '../utils/middleware/checkAuth'


const taskFileRouter = express.Router()

taskFileRouter.post('/', checkAuth(['Admin', 'Employee']),  taskFileController.create)

taskFileRouter.delete('/:taskFileId/task/:taskId', checkAuth(['Admin', 'Employee']),  taskFileController.delete)

taskFileRouter.get('/task/:taskId',  taskFileController.getAll)

export default taskFileRouter


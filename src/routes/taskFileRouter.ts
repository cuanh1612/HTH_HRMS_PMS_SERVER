import express from 'express'
import taskFileController from '../controllers/taskFileController'


const taskFileRouter = express.Router()

taskFileRouter.post('/',  taskFileController.create)

taskFileRouter.delete('/:taskFileId/task/:taskId',  taskFileController.delete)

taskFileRouter.get('/task/:taskId',  taskFileController.getAll)

export default taskFileRouter


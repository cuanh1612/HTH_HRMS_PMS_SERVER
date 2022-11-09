import express from 'express'
import taskCommentController from '../controllers/taskComment.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const taskCommentRouter = express.Router()

taskCommentRouter.post('/', checkAuth([]), taskCommentController.create)

taskCommentRouter.get('/task/:taskId', checkAuth([]), taskCommentController.getByTask)

taskCommentRouter.delete('/:taskCommentId', checkAuth([]), taskCommentController.delete)

taskCommentRouter.put('/:taskCommentId', checkAuth([]), taskCommentController.update)

export default taskCommentRouter

import express from 'express'
import discussionController from '../controllers/discussionController'
import { checkAuth } from '../utils/middleware/checkAuth'

const discussionRouter = express.Router()

discussionRouter.post('/', checkAuth([]), discussionController.create)

discussionRouter.get('/contract/:contractId', checkAuth([]), discussionController.getByContract)

discussionRouter.delete('/:discussionId', checkAuth([]), discussionController.delele)

discussionRouter.put('/:discussionId',checkAuth([]), discussionController.update)

export default discussionRouter

import express from 'express'
import discussionController from '../controllers/discussionController'

const discussionRouter = express.Router()

discussionRouter.post('/', discussionController.create)

discussionRouter.get('/contract/:contractId', discussionController.getByContract)

discussionRouter.delete('/:discussionId', discussionController.delele)

discussionRouter.put('/:discussionId', discussionController.update)

export default discussionRouter

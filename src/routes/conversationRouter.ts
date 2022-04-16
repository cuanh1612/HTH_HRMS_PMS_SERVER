import express from 'express'
import conversationController from '../controllers/conversationController'

const conversationRouter = express.Router()

conversationRouter.post('/', conversationController.create)

conversationRouter.get('/user/:userId', conversationController.getByUser)

conversationRouter.delete('/:conversationId/user/:userId', conversationController.delete)

export default conversationRouter

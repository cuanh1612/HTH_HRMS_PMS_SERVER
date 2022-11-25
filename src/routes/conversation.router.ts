import express from 'express'
import conversationController from '../controllers/conversation.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const conversationRouter = express.Router()

conversationRouter.post('/', checkAuth([]), conversationController.create)

conversationRouter.get('/user/:userId', checkAuth([]), conversationController.getByUser)

conversationRouter.delete(
	'/:conversationId/user/:userId',
	checkAuth([]),
	conversationController.delete
)

export default conversationRouter

import express from 'express'
import conversationReplyController from '../controllers/conversationReply.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const conversationReplyRouter = express.Router()

conversationReplyRouter.post('/', checkAuth([]), conversationReplyController.create)

conversationReplyRouter.get('/conversation/:conversationId', checkAuth([]), conversationReplyController.getByConversation)

export default conversationReplyRouter

import express from 'express'
import conversationReplyController from '../controllers/conversationReplyController'

const conversationReplyRouter = express.Router()

conversationReplyRouter.post('/', conversationReplyController.create)

conversationReplyRouter.get('/conversation/:conversationId', conversationReplyController.getByConversation)

export default conversationReplyRouter

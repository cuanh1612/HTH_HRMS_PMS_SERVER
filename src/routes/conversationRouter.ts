import express from 'express'
import conversationController from '../controllers/conversationController'

const conversationRouter = express.Router()

conversationRouter.post('/', conversationController.create)

conversationRouter.get('/user/:userId', conversationController.getByUser)

export default conversationRouter

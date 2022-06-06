import express from 'express'
import notificationController from '../controllers/notificationController'
import { checkAuth } from '../utils/middleware/checkAuth'

const NotificationRouter = express.Router()

NotificationRouter.post('/', checkAuth([]), notificationController.create)
NotificationRouter.get('/', checkAuth([]), notificationController.getAllByCurrentUser)
NotificationRouter.delete('/:notificationId', checkAuth([]), notificationController.delete)

export default NotificationRouter

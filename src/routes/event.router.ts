import express from 'express'
import eventController from '../controllers/event.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const eventRouter = express.Router()

eventRouter.post('/', checkAuth(['Admin']), eventController.create)

eventRouter.get('/', eventController.getAll)
eventRouter.get('/employee/:employeeId', eventController.getByEmployee)
eventRouter.get('/:eventId', eventController.getDetail)

eventRouter.delete('/:eventId', checkAuth(['Admin']), eventController.delete)

eventRouter.put('/:eventId', checkAuth(['Admin']), eventController.update)

export default eventRouter

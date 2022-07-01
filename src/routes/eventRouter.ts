import express from 'express'
import eventController from '../controllers/eventController'
import { checkAuth } from '../utils/middleware/checkAuth'

const eventRouter = express.Router()

eventRouter.post('/', checkAuth(['Admin']), eventController.create)

eventRouter.get('/', eventController.getAll)
eventRouter.get('/employee/:employeeId', eventController.getByEmployee)
eventRouter.get('/:enventId', eventController.getDetail)

eventRouter.delete('/:enventId', checkAuth(['Admin']), eventController.delete)

eventRouter.put('/:enventId', checkAuth(['Admin']), eventController.update)

export default eventRouter

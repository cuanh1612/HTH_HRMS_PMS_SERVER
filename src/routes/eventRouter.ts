import express from 'express'
import eventController from '../controllers/eventController'

const eventRouter = express.Router()

eventRouter.post('/', eventController.create)

eventRouter.get('/', eventController.getAll)
eventRouter.get('/:enventId', eventController.getDetail)

eventRouter.delete('/:enventId', eventController.delete)

eventRouter.put('/:enventId', eventController.update)

export default eventRouter

import express from 'express'
import roomController from '../controllers/roomController'

const projectRouter = express.Router()

projectRouter.get('/', roomController.getAll)

projectRouter.post('/', roomController.create)

projectRouter.delete('/', roomController.delete)

projectRouter.get('/:id', roomController.getDetail)

export default projectRouter

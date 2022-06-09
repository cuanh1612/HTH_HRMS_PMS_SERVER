import express from 'express'
import roomController from '../controllers/roomController'

const projectRouter = express.Router()

projectRouter.get('/', roomController.getAll)

projectRouter.post('/', roomController.create)

projectRouter.delete('/:id', roomController.delete)

projectRouter.put('/:id', roomController.update)

projectRouter.get('/title/:title', roomController.getByTitle)

projectRouter.get('/:id', roomController.getDetail)


export default projectRouter

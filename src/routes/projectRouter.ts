import express from 'express'
import projectController from '../controllers/projectController'


const projectRouter = express.Router()

projectRouter.post('/', projectController.create)


projectRouter.put('/:id', projectController.update)

projectRouter.get('/', projectController.getAll)
projectRouter.get('/:id', projectController.getDetail)

projectRouter.delete('/:id', projectController.delete)
projectRouter.post('/delete-many', projectController.deletemany)

export default projectRouter
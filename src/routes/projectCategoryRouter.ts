import express from 'express'
import projectCategoryController from '../controllers/projectCategoryController'


const projectCategoryRouter = express.Router()

projectCategoryRouter.post('/', projectCategoryController.create)


projectCategoryRouter.put('/:id', projectCategoryController.update)

projectCategoryRouter.get('/', projectCategoryController.getAll)
projectCategoryRouter.get('/:id', projectCategoryController.getDetail)

projectCategoryRouter.delete('/:id', projectCategoryController.delete)

export default projectCategoryRouter
import express from 'express'
import projectCategoryController from '../controllers/projectCategory.controller'
import { checkAuth } from '../utils/middleware/checkAuth'


const projectCategoryRouter = express.Router()

projectCategoryRouter.post('/', checkAuth(['Admin']), projectCategoryController.create)


projectCategoryRouter.put('/:id', checkAuth(['Admin']), projectCategoryController.update)

projectCategoryRouter.get('/', projectCategoryController.getAll)

projectCategoryRouter.get('/:id', projectCategoryController.getDetail)

projectCategoryRouter.delete('/:id', checkAuth(['Admin']), projectCategoryController.delete)

export default projectCategoryRouter
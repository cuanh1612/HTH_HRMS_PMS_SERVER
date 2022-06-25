import express from 'express'
import projectDiscussionCategoryController from '../controllers/projectDiscussionCategoryController'
import { checkAuth } from '../utils/middleware/checkAuth'


const projectDiscussionCategoryRouter = express.Router()

projectDiscussionCategoryRouter.post('/', checkAuth([]), projectDiscussionCategoryController.create)
projectDiscussionCategoryRouter.get('/', projectDiscussionCategoryController.getAll)
projectDiscussionCategoryRouter.get('/:id', projectDiscussionCategoryController.getDetail)
projectDiscussionCategoryRouter.delete('/:id', checkAuth([]), projectDiscussionCategoryController.delete)
projectDiscussionCategoryRouter.put('/:id', checkAuth([]), projectDiscussionCategoryController.update)


export default projectDiscussionCategoryRouter

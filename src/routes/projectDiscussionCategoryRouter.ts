import express from 'express'
import projectDiscussionCategoryController from '../controllers/projectDiscussionCategoryController'


const projectDiscussionCategoryRouter = express.Router()

projectDiscussionCategoryRouter.post('/', projectDiscussionCategoryController.create)
projectDiscussionCategoryRouter.get('/', projectDiscussionCategoryController.getAll)
projectDiscussionCategoryRouter.get('/:id', projectDiscussionCategoryController.getDetail)
projectDiscussionCategoryRouter.delete('/:id', projectDiscussionCategoryController.delete)
projectDiscussionCategoryRouter.put('/:id', projectDiscussionCategoryController.update)


export default projectDiscussionCategoryRouter

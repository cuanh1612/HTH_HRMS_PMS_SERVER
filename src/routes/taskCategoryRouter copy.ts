import express from 'express'
import taskCategoryController from '../controllers/taskCategoryController'


const taskCategoryRouter = express.Router()

taskCategoryRouter.post('/', taskCategoryController.create)


taskCategoryRouter.put('/:id', taskCategoryController.update)

taskCategoryRouter.get('/', taskCategoryController.getAll)
taskCategoryRouter.get('/:id', taskCategoryController.getDetail)

taskCategoryRouter.delete('/:id', taskCategoryController.delete)

export default taskCategoryRouter
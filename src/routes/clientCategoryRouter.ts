import express from 'express'
import clientCategoryController from '../controllers/clientCategoryController'

const clientCategoryRouter = express.Router()

clientCategoryRouter.post('/', clientCategoryController.create)

clientCategoryRouter.put('/:id', clientCategoryController.update)

clientCategoryRouter.delete('/:id', clientCategoryController.delete)

clientCategoryRouter.get('/', clientCategoryController.getAll)

export default clientCategoryRouter

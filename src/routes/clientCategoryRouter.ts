import express from 'express'
import clientCategoryController from '../controllers/clientCategoryController'
import { checkAuth } from '../utils/middleware/checkAuth'

const clientCategoryRouter = express.Router()

clientCategoryRouter.post('/', checkAuth(['Admin']), clientCategoryController.create)

clientCategoryRouter.put('/:id', checkAuth(['Admin']), clientCategoryController.update)

clientCategoryRouter.delete('/:id', checkAuth(['Admin']), clientCategoryController.delete)

clientCategoryRouter.get('/', clientCategoryController.getAll)

export default clientCategoryRouter

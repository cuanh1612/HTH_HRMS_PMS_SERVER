import express from 'express'
import clientSubCategoryController from '../controllers/clientSubCategory.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const clientSubCategoryRouter = express.Router()

clientSubCategoryRouter.post('/', checkAuth(['Admin']), clientSubCategoryController.create)

clientSubCategoryRouter.put('/:id', checkAuth(['Admin']), clientSubCategoryController.update)

clientSubCategoryRouter.delete('/:id', checkAuth(['Admin']), clientSubCategoryController.delete)

clientSubCategoryRouter.get('/', clientSubCategoryController.getAll)

export default clientSubCategoryRouter

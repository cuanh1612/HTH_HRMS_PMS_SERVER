import express from 'express'
import clientSubCategoryController from '../controllers/clientSubCategoryController'

const clientSubCategoryRouter = express.Router()

clientSubCategoryRouter.post('/', clientSubCategoryController.create)

clientSubCategoryRouter.put('/:id', clientSubCategoryController.update)

clientSubCategoryRouter.delete('/:id', clientSubCategoryController.delete)

clientSubCategoryRouter.get('/', clientSubCategoryController.getAll)

export default clientSubCategoryRouter

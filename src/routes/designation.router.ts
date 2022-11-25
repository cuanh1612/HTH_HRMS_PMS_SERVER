import express from 'express'
import designationController from '../controllers/designation.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const designationRouter = express.Router()

designationRouter.post('/', checkAuth(['Admin']), designationController.create)


designationRouter.put('/:id', checkAuth(['Admin']), designationController.update)

designationRouter.get('/', designationController.getAll)
designationRouter.get('/:id', designationController.getDetail)

designationRouter.delete('/:id', checkAuth(['Admin']), designationController.delete)

export default designationRouter
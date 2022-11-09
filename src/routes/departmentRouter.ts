import express from 'express'
import departmentController from '../controllers/department.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const departmentRouter = express.Router()

departmentRouter.post('/', checkAuth(['Admin']), departmentController.create)


departmentRouter.put('/:id', checkAuth(['Admin']), departmentController.update)

departmentRouter.get('/', departmentController.getAll)
departmentRouter.get('/:id', departmentController.getDetail)

departmentRouter.delete('/:id', checkAuth(['Admin']), departmentController.delete)

export default departmentRouter
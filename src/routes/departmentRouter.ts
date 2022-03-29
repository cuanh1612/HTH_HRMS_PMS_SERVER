import express from 'express'
import departmentController from '../controllers/departmentController'

const departmentRouter = express.Router()

departmentRouter.post('/', departmentController.create)


departmentRouter.put('/:id', departmentController.update)

departmentRouter.get('/', departmentController.getAll)
departmentRouter.get('/:id', departmentController.getDetail)

departmentRouter.delete('/:id', departmentController.delete)

export default departmentRouter
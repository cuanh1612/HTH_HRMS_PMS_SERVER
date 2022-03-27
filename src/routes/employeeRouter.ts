import express from 'express'
import employeeController from '../controllers/employeeController'

const userRouter = express.Router()

userRouter.post('/', employeeController.create)

userRouter.put('/role', employeeController.changeRole)
userRouter.put('/:employeeId', employeeController.update)

userRouter.get('/', employeeController.getAll)
userRouter.get('/:employeeId', employeeController.getDetail)

userRouter.delete('/:employeeId', employeeController.delete)

export default userRouter

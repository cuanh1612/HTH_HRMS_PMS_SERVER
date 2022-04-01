import express from 'express'
import employeeController from '../controllers/employeeController'
import { checkAuth } from '../utils/middleware/checkAuth';

const userRouter = express.Router()

userRouter.post('/', checkAuth(['Admin']), employeeController.create);
userRouter.post('/delete_may', checkAuth(['Admin']), employeeController.deleteMany);

userRouter.put('/role', checkAuth(['Admin']), employeeController.changeRole)
userRouter.put('/:employeeId', checkAuth(['Admin']), employeeController.update)

userRouter.get('/', checkAuth([]), employeeController.getAll)
userRouter.get('/:employeeId', checkAuth([]), employeeController.getDetail)

userRouter.delete('/:employeeId', checkAuth(['Admin']), employeeController.delete)

export default userRouter

import express from 'express'
import leaveController from '../controllers/leaveController'
import { checkAuth } from '../utils/middleware/checkAuth'

const leaveRouter = express.Router()

leaveRouter.post('/', checkAuth(['Admin', 'Employee']), leaveController.create)
leaveRouter.post('/delete-many', checkAuth(['Admin', 'Employee']), leaveController.deleteMany)

leaveRouter.get('/', leaveController.getAll)
leaveRouter.get('/:leaveId', leaveController.getDetail)

leaveRouter.delete('/:leaveId', checkAuth(['Admin', 'Employee']), leaveController.delete)

leaveRouter.put('/:leaveId', checkAuth(['Admin']), leaveController.update)

leaveRouter.put('/status/:leaveId', checkAuth(['Admin', 'Employee']), leaveController.updateStatus)


export default leaveRouter

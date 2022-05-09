import express from 'express'
import leaveController from '../controllers/leaveController'
import { checkAuth } from '../utils/middleware/checkAuth'

const leaveRouter = express.Router()

leaveRouter.post('/', checkAuth(['Admin']), leaveController.create)
leaveRouter.post('/delete_many', checkAuth(['Admin']), leaveController.deleteMany)

leaveRouter.get('/', leaveController.getAll)
leaveRouter.get('/:leaveId', leaveController.getDetail)

leaveRouter.delete('/:leaveId', checkAuth(['Admin']), leaveController.delete)

leaveRouter.put('/:leaveId', checkAuth(['Admin']), leaveController.update)

leaveRouter.put('/status/:leaveId', leaveController.updateStatus)


export default leaveRouter

import express from 'express'
import leaveController from '../controllers/leaveController'

const leaveRouter = express.Router()

leaveRouter.post('/', leaveController.create)
leaveRouter.post('/delete-many', leaveController.deleteMany)

leaveRouter.get('/', leaveController.getAll)
leaveRouter.get('/:leaveId', leaveController.getDetail)

leaveRouter.delete('/:leaveId', leaveController.delete)

leaveRouter.put('/:leaveId', leaveController.update)

leaveRouter.put('/status/:leaveId', leaveController.updateStatus)


export default leaveRouter

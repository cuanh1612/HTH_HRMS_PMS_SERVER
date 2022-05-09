import express from 'express'
import leaveController from '../controllers/leaveController'
import { checkAuth } from '../utils/middleware/checkAuth'

const leaveRouter = express.Router()

<<<<<<< HEAD
leaveRouter.post('/', leaveController.create)
leaveRouter.post('/delete-many', leaveController.deleteMany)
=======
leaveRouter.post('/', checkAuth(['Admin']), leaveController.create)
leaveRouter.post('/delete_many', checkAuth(['Admin']), leaveController.deleteMany)
>>>>>>> 5b4245ec80043f977be9e81dbee71ce78487dd1a

leaveRouter.get('/', leaveController.getAll)
leaveRouter.get('/:leaveId', leaveController.getDetail)

leaveRouter.delete('/:leaveId', checkAuth(['Admin']), leaveController.delete)

leaveRouter.put('/:leaveId', checkAuth(['Admin']), leaveController.update)

leaveRouter.put('/status/:leaveId', leaveController.updateStatus)


export default leaveRouter

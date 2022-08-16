import express from 'express'
import milestoneController from '../controllers/milestoneController'
import { checkAuth } from '../utils/middleware/checkAuth'


//have check auth in controller

const milestoneRouter = express.Router()

milestoneRouter.post('/', milestoneController.create)

milestoneRouter.get('/normal', checkAuth([]), milestoneController.getAll)
milestoneRouter.put('/:id', milestoneController.update)
milestoneRouter.get('/normal/:id', checkAuth([]), milestoneController.getByProject)
milestoneRouter.get('/detail/:id', checkAuth([]), milestoneController.getDetail)
milestoneRouter.get('/:id', checkAuth([]), milestoneController.getByProjectWithTask)


milestoneRouter.delete('/:id', milestoneController.delete)


export default milestoneRouter
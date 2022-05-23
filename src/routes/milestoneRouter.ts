import express from 'express'
import milestoneController from '../controllers/milestoneController'



const milestoneRouter = express.Router()

milestoneRouter.post('/', milestoneController.create)

milestoneRouter.put('/:id', milestoneController.update)

milestoneRouter.get('/normal/:id', milestoneController.getByProject)
milestoneRouter.get('/:id', milestoneController.getByProjectWithTask)


milestoneRouter.delete('/:id', milestoneController.delete)


export default milestoneRouter
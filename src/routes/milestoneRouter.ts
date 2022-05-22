import express from 'express'
import milestoneController from '../controllers/milestoneController'



const milestoneRouter = express.Router()

milestoneRouter.post('/', milestoneController.create)


milestoneRouter.put('/:id', milestoneController.update)

milestoneRouter.get('/', milestoneController.getAll)
milestoneRouter.get('/:id', milestoneController.getDetail)

milestoneRouter.delete('/:id', milestoneController.delete)


export default milestoneRouter
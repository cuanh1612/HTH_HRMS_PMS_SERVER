import express from 'express'
import milestoneController from '../controllers/milestoneController'



const milestoneRouter = express.Router()

milestoneRouter.post('/', milestoneController.create)


milestoneRouter.put('/:id', milestoneController.update)

milestoneRouter.get('/', milestoneController.getall)
milestoneRouter.get('/:id', milestoneController.getdetail)

milestoneRouter.delete('/:id', milestoneController.delete)
milestoneRouter.post('/delete-many', milestoneController.deletemany)

export default milestoneRouter
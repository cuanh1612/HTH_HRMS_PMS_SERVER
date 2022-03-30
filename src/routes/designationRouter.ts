import express from 'express'
import designationController from '../controllers/designationController'

const designationRouter = express.Router()

designationRouter.post('/', designationController.create)


designationRouter.put('/:id', designationController.update)

designationRouter.get('/', designationController.getAll)
designationRouter.get('/:id', designationController.getDetail)

designationRouter.delete('/:id', designationController.delete)

export default designationRouter
import express from 'express'
import contractController from '../controllers/contractController'

const contractRouter = express.Router()

contractRouter.post('/', contractController.create)
contractRouter.post('/delete-many', contractController.deleteMany);

contractRouter.get('/', contractController.getAll)
contractRouter.get('/:contractId', contractController.getDetail)

contractRouter.delete('/:contractId', contractController.delete)

contractRouter.put('/:contractId', contractController.update)

export default contractRouter

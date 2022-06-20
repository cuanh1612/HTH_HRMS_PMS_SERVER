import express from 'express'
import contractController from '../controllers/contractController'
import { checkAuth } from '../utils/middleware/checkAuth'

const contractRouter = express.Router()

contractRouter.post('/', checkAuth(['Admin']), contractController.create)

contractRouter.post('/public-link', checkAuth(['Admin']), contractController.publicLink)

contractRouter.get('/public/:token', contractController.public)

contractRouter.post('/delete-many', checkAuth(['Admin']), contractController.deleteMany)

contractRouter.get('/', contractController.getAll)

contractRouter.get('/:contractId', checkAuth(['Admin', 'Client']), contractController.getDetail)

contractRouter.delete('/:contractId', checkAuth(['Admin']), contractController.delete)

contractRouter.put('/:contractId', checkAuth(['Admin']), contractController.update)

contractRouter.post('/csv', checkAuth(['Admin']), contractController.importCSV)

contractRouter.get('/client/:clientId/count-contracts-assigned', contractController.countContractSignedEmployee)

export default contractRouter
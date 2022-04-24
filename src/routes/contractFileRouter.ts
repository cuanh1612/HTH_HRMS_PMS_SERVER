import express from 'express'
import contractFileController from '../controllers/contractFileController'
import { checkAuth } from '../utils/middleware/checkAuth'

const contractFileRouter = express.Router()

contractFileRouter.post('/', checkAuth(['Admin']), contractFileController.create)

contractFileRouter.delete('/:contractFileId/contract/:contractId', checkAuth(['Admin']), contractFileController.delete)

contractFileRouter.get('/contract/:contractId', checkAuth(['Admin', 'Client']), contractFileController.getAll)

export default contractFileRouter

import express from 'express'
import contractFileController from '../controllers/contractFileController'

const contractFileRouter = express.Router()

contractFileRouter.post('/', contractFileController.create)

contractFileRouter.delete('/:contractFileId/contract/:contractId', contractFileController.delete)

contractFileRouter.get('/contract/:contractId', contractFileController.getAll)

export default contractFileRouter

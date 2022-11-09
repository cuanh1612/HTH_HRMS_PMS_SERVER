import express from 'express'
import contractTypeController from '../controllers/contractType.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const contractTypeRouter = express.Router()

contractTypeRouter.post('/', checkAuth(['Admin']), contractTypeController.create)

contractTypeRouter.get('/', contractTypeController.getAll)
contractTypeRouter.get('/:id', contractTypeController.getDetail)

contractTypeRouter.delete('/:id', checkAuth(['Admin']), contractTypeController.delete)

contractTypeRouter.put('/:id', checkAuth(['Admin']), contractTypeController.update)

export default contractTypeRouter

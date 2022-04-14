import express from 'express';
import contractTypeController from '../controllers/contractTypeController';

const contractTypeRouter = express.Router()

contractTypeRouter.post('/', contractTypeController.create)

contractTypeRouter.get('/', contractTypeController.getAll)
contractTypeRouter.get('/:id', contractTypeController.getDetail)

contractTypeRouter.delete('/:id', contractTypeController.delete)

contractTypeRouter.put('/:id', contractTypeController.update)

export default contractTypeRouter

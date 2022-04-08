import express from 'express';
import contractTypeContrller from '../controllers/contractTypeController';

const contractTypeRouter = express.Router()

contractTypeRouter.post('/', contractTypeContrller.create)

contractTypeRouter.get('/', contractTypeContrller.getAll)
contractTypeRouter.get('/:id', contractTypeContrller.getDetail)

contractTypeRouter.delete('/:id', contractTypeContrller.delete)

contractTypeRouter.put('/:id', contractTypeContrller.update)

export default contractTypeRouter

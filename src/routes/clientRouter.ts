import express from 'express';
import clientController from '../controllers/clientController';

const clientRouter = express.Router()

clientRouter.post('/', clientController.create);
clientRouter.post('/delete_may', clientController.deleteMany);

clientRouter.put('/:clientId', clientController.update)

clientRouter.get('/', clientController.getAll)
clientRouter.get('/:clientId', clientController.getDetail)

clientRouter.delete('/:clientId', clientController.delete)

export default clientRouter
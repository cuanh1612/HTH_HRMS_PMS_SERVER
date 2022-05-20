import express from 'express';
import clientController from '../controllers/clientController';
import { checkAuth } from '../utils/middleware/checkAuth';

const clientRouter = express.Router()

clientRouter.post('/', checkAuth(['Admin']), clientController.create);
clientRouter.post('/delete-many', checkAuth(['Admin']), clientController.deleteMany);

clientRouter.put('/:clientId', checkAuth(['Admin']), clientController.update)

clientRouter.get('/', checkAuth(['Admin']), clientController.getAll)
clientRouter.get('/:clientId', checkAuth([]), clientController.getDetail)

clientRouter.delete('/:clientId', checkAuth(['Admin']), clientController.delete)

export default clientRouter
import express from 'express';
import clientController from '../controllers/clientController';
import { checkAuth } from '../utils/middleware/checkAuth';

const clientRouter = express.Router()

clientRouter.post('/', checkAuth(['Admin']), clientController.create);
clientRouter.post('/delete-many', checkAuth(['Admin']), clientController.deleteMany);

clientRouter.put('/:clientId', checkAuth(['Admin']), clientController.update)

clientRouter.get('/', clientController.getAll)
clientRouter.get('/:clientId', checkAuth([]), clientController.getDetail)
clientRouter.get('/:clientId/total-projects', checkAuth([]), clientController.totalProjects)
clientRouter.get('/:clientId/total-earnings',  checkAuth([]), clientController.totalEarnings)
clientRouter.get('/:clientId/status-projects',  checkAuth([]), clientController.statusProjects)
clientRouter.get('/:clientId/projects', checkAuth([]), clientController.projects)

clientRouter.delete('/:clientId', checkAuth(['Admin']), clientController.delete)

export default clientRouter
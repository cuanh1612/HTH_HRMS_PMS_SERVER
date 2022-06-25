import express from 'express'
import clientController from '../controllers/clientController'
import { checkAuth } from '../utils/middleware/checkAuth'

const clientRouter = express.Router()

clientRouter.post('/', checkAuth(['Admin']), clientController.create)
clientRouter.post('/delete-many', checkAuth(['Admin']), clientController.deleteMany)

clientRouter.put('/:clientId', checkAuth(['Admin']), clientController.update)

clientRouter.get('/normal', clientController.getNormal)
clientRouter.get('/', checkAuth([]), clientController.getAll)
clientRouter.get('/:clientId', checkAuth([]), clientController.getDetail)
clientRouter.get(
	'/:clientId/total-projects',
	checkAuth(['Admin', 'Client']),
	clientController.totalProjects
)
clientRouter.get(
	'/:clientId/total-earnings',
	checkAuth(['Admin', 'Client']),
	clientController.totalEarnings
)
clientRouter.get(
	'/:clientId/status-projects',
	checkAuth(['Admin', 'Client']),
	clientController.statusProjects
)
clientRouter.get('/:clientId/projects', checkAuth(['Admin', 'Client']), clientController.projects)
clientRouter.get(
	'/:clientId/pending-milestone',
	checkAuth(['Admin', 'Client']),
	clientController.pendingMilestone
)
clientRouter.post('/csv', checkAuth(['Admin']), clientController.importCSV)
clientRouter.delete('/:clientId', checkAuth(['Admin']), clientController.delete)

export default clientRouter

import express from 'express'
import projectController from '../controllers/project.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const projectRouter = express.Router()

projectRouter.post('/delete-employee', checkAuth([]), projectController.deleteEmployee)
projectRouter.post('/', checkAuth([]), projectController.create)

projectRouter.put('/assign-employee/:projectId', checkAuth([]), projectController.assignEmployee)
projectRouter.put(
	'/assign-employee/department/:projectId',
	checkAuth([]),
	projectController.assignEmployeeByDepartment
)
projectRouter.put('/:id', checkAuth([]), projectController.update)
projectRouter.get('/:projectId/change-status', checkAuth([]), projectController.changeStatus)

projectRouter.get('/', checkAuth([]), projectController.getAll)
projectRouter.get('/current-user', checkAuth([]), projectController.getAllByCurrentUser)
projectRouter.get('/normal', projectController.getAllNormal)
projectRouter.get('/:id', projectController.getDetail)
projectRouter.get(
	'/normal/employee/:employeeId',
	checkAuth(['Admin', 'Employee']),
	projectController.getAllNormalByEmployee
)
projectRouter.get(
	'/normal/client/:clientId',
	checkAuth(['Admin']),
	projectController.getAllNormalByClient
)
projectRouter.get(
	'/get-employees-not-in-project/:projectId',
	checkAuth([]),
	projectController.getEmployeeNotIn
)
projectRouter.get('/all-employees/:idProject', checkAuth([]), projectController.allEmployees)
projectRouter.get('/:projectId/check-assigned', checkAuth([]), projectController.checkAssigned)
projectRouter.get(
	'/:projectId/count-status-tasks',
	checkAuth(['Admin']),
	projectController.countstatusTasks
)
projectRouter.get('/:projectId/earnings', checkAuth(['Admin']), projectController.projectEarnings)
projectRouter.get(
	'/:projectId/Hours-logged',
	checkAuth(['Admin']),
	projectController.projectHoursLogged
)
projectRouter.get(
	'/client/:clientId/project-status',
	checkAuth(['Admin', 'Client']),
	projectController.projectStatusByClient
)

projectRouter.delete('/:id', checkAuth(['Admin']), projectController.delete)

projectRouter.post('/delete-many', checkAuth(['Admin']), projectController.deleteMany)
projectRouter.post('/project-admin', checkAuth(['Admin']), projectController.setProjectAdmin)

export default projectRouter

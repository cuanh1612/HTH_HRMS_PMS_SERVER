import express from 'express'
import projectController from '../controllers/projectController'


const projectRouter = express.Router()

projectRouter.post('/delete-employee', projectController.deleteEmployee)
projectRouter.post('/', projectController.create)

projectRouter.put('/assign-employee/:projectId', projectController.assignEmployee)
projectRouter.put('/assign-employee/department/:projectId', projectController.assignEmployeeByDepartment)
projectRouter.put('/:id', projectController.update)
projectRouter.get('/:projectId/change-status', projectController.changeStatus)

projectRouter.get('/', projectController.getAll)
projectRouter.get('/current-user', projectController.getAllByCurrentUser)
projectRouter.get('/normal', projectController.getAllNormal)
projectRouter.get('/:id', projectController.getDetail)
projectRouter.get('/normal/employee/:employeeId', projectController.getAllNormalByEmployee)
projectRouter.get('/get-employees-not-in-project/:projectId', projectController.getEmployeeNotIn)
projectRouter.get('/all-employees/:idProject', projectController.allEmployees)
projectRouter.get('/:projectId/check-assigned', projectController.checkAssigned)
projectRouter.get('/:projectId/count-status-tasks', projectController.countstatusTasks)
projectRouter.get('/:projectId/earnings', projectController.projectEarnings)
projectRouter.get('/:projectId/Hours-logged', projectController.projectHoursLogged)

projectRouter.delete('/:id', projectController.delete)

projectRouter.post('/delete-many', projectController.deletemany)
projectRouter.post('/project-admin', projectController.setProjectAdmin)

export default projectRouter
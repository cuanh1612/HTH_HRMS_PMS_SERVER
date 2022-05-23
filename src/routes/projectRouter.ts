import express from 'express'
import projectController from '../controllers/projectController'


const projectRouter = express.Router()

projectRouter.post('/delete-employee', projectController.deleteEmployee)
projectRouter.post('/', projectController.create)

projectRouter.put('/:id', projectController.update)

projectRouter.get('/get-employees-not-in-project/:projectId', projectController.getEmployeeNotIn)
projectRouter.get('/all-employees/:idProject', projectController.allEmployees)
projectRouter.get('/:projectId/check-asigned', projectController.checkAssigned)
projectRouter.get('/', projectController.getAll)
projectRouter.get('/:id', projectController.getDetail)

projectRouter.delete('/:id', projectController.delete)

projectRouter.post('/delete-many', projectController.deletemany)
projectRouter.post('/project-admin', projectController.setProjectAdmin)

export default projectRouter
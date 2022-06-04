import express from "express"
import taskController from "../controllers/taskController"


const taskRouter = express.Router()

taskRouter.post('/', taskController.create)

taskRouter.get('/calendar', taskController.calendar)
taskRouter.get('/calendar-employee/:employeeId', taskController.calendarByEmployee)
taskRouter.get('/', taskController.getAll)
taskRouter.get('/:id', taskController.getDetail)
taskRouter.get('/project/:projectId', taskController.getByProject)
taskRouter.get('/employee/:employeeId', taskController.getByEmployee)
taskRouter.get('/project/:projectId/employee/:employeeId', taskController.getByEmployeeAndProject)

taskRouter.delete('/:id', taskController.delete)
taskRouter.post('/delete-many', taskController.deletemany)

taskRouter.put('/position', taskController.changeposition)
taskRouter.put('/:id', taskController.update)



export default taskRouter
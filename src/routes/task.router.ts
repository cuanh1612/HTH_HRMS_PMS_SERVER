import express from "express"
import taskController from "../controllers/task.controller"
import { checkAuth } from "../utils/middleware/checkAuth"


const taskRouter = express.Router()

taskRouter.post('/', checkAuth([]), taskController.create)

taskRouter.get('/calendar', taskController.calendar)
taskRouter.get('/calendar-employee/:employeeId', taskController.calendarByEmployee)
taskRouter.get('/', taskController.getAll)
taskRouter.get('/:id', taskController.getDetail)
taskRouter.get('/project/:projectId', taskController.getByProject)
taskRouter.get('/employee/:employeeId', taskController.getByEmployee)
taskRouter.get('/project/:projectId/employee/:employeeId', taskController.getByEmployeeAndProject)

taskRouter.delete('/:id', checkAuth([]), taskController.delete)
taskRouter.post('/delete-many', checkAuth([]), taskController.deleteMany)

taskRouter.put('/position', checkAuth([]), taskController.changePosition)
taskRouter.put('/:id', checkAuth([]), taskController.update)



export default taskRouter
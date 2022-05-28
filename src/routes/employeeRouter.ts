import express from 'express'
import employeeController from '../controllers/employeeController'
import { checkAuth } from '../utils/middleware/checkAuth';

const userRouter = express.Router()

userRouter.post('/', checkAuth(['Admin']), employeeController.create);
userRouter.post('/delete-many', checkAuth(['Admin']), employeeController.deleteMany);

userRouter.put('/role', checkAuth(['Admin']), employeeController.changeRole)
userRouter.put('/:employeeId', checkAuth(['Admin']), employeeController.update)

userRouter.get('/normal', employeeController.getNormal)
userRouter.get('/', checkAuth([]), employeeController.getAll)
userRouter.get('/:employeeId', checkAuth([]), employeeController.getDetail)
userRouter.get('/:employeeId/open-tasks', checkAuth([]), employeeController.getOpenTasks)
userRouter.get('/:employeeId/hours-logged', checkAuth([]), employeeController.getHoursLogged)
userRouter.get('/:employeeId/count-projects', checkAuth([]), employeeController.getCountProjects)
userRouter.get('/:employeeId/late-attendance', checkAuth([]), employeeController.getLateAttendance)
userRouter.get('/:employeeId/count-leaves-taken', checkAuth([]), employeeController.countLeavesTaken)
userRouter.get('/:employeeId/count-tasks-status',checkAuth([]), employeeController.countTasksStatus)
userRouter.get('/:employeeId/tasks', checkAuth([]), employeeController.getTasks)
// userRouter.get('/:employeeId/count-pending-tasks', checkAuth([]), employeeController.getCountPendingTasks)
// userRouter.get('/:employeeId/getCountOverdueTasks', employeeController.getCountOverdueTasks)

userRouter.delete('/:employeeId', checkAuth(['Admin']), employeeController.delete)

export default userRouter

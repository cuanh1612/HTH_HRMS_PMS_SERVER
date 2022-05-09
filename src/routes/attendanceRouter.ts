import express from 'express'
import attendanceController from '../controllers/attendanceController'
import { checkAuth } from '../utils/middleware/checkAuth'

const attendanceRouter = express.Router()

<<<<<<< HEAD
attendanceRouter.get('/', attendanceController.getAll)

attendanceRouter.post('/', attendanceController.create)
=======
attendanceRouter.post('/', checkAuth(['Admin']), attendanceController.create)
>>>>>>> 5b4245ec80043f977be9e81dbee71ce78487dd1a

attendanceRouter.put('/:id', checkAuth(['Admin']), attendanceController.update)

attendanceRouter.get('/:id', attendanceController.getDetail)

attendanceRouter.delete('/:id', checkAuth(['Admin']), attendanceController.delete)

export default attendanceRouter

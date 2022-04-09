import express from 'express'
import attendanceController from '../controllers/attendanceController'

const attendanceRouter = express.Router()

attendanceRouter.post('/', attendanceController.create)

attendanceRouter.put('/:id', attendanceController.update)

attendanceRouter.get('/:id', attendanceController.getDetail)

attendanceRouter.delete('/:id', attendanceController.delete)

export default attendanceRouter

import express from 'express'
import salaryController from '../controllers/salary.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const salaryRouter = express.Router()

salaryRouter.post('/', checkAuth(['Admin']), salaryController.create)
salaryRouter.get('/', checkAuth([]), salaryController.getAll)
salaryRouter.get('/employee/:employeeId', checkAuth([]), salaryController.getHistoryByUser)
salaryRouter.delete('/:salaryId', checkAuth(['Admin']), salaryController.delete)

export default salaryRouter

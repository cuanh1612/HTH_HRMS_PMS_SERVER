import express from 'express'
import salaryController from '../controllers/salaryController'
import { checkAuth } from '../utils/middleware/checkAuth'

const salaryRouter = express.Router()

salaryRouter.post('/', checkAuth([]), salaryController.create)
salaryRouter.get('/', checkAuth([]), salaryController.getAll)
salaryRouter.get('/employee/:employeeId', checkAuth([]), salaryController.getHistoryByUser)
salaryRouter.delete('/:salaryId', checkAuth([]), salaryController.delete)

export default salaryRouter

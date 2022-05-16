import express from 'express'
import salaryController from '../controllers/salaryController'
import { checkAuth } from '../utils/middleware/checkAuth'

const salaryRouter = express.Router()

salaryRouter.post('/', checkAuth([]), salaryController.create)
salaryRouter.get('/', checkAuth([]), salaryController.getAll)

export default salaryRouter

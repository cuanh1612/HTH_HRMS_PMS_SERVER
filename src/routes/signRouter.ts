import express from 'express'
import signController from '../controllers/signController'
import { checkAuth } from '../utils/middleware/checkAuth'

const signRouter = express.Router()

signRouter.post('/', checkAuth(['Admin']), signController.create)

export default signRouter
 
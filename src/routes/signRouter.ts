import express from 'express'
import signController from '../controllers/sign.controller'
import { checkAuth } from '../utils/middleware/checkAuth'

const signRouter = express.Router()

signRouter.post('/contract', checkAuth(['Admin']), signController.createConTractSign)
signRouter.post('/job-offer-letter', checkAuth(['Admin']), signController.createJobOfferSign)

export default signRouter
 
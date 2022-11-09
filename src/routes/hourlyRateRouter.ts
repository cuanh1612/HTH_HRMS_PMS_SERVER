import express from 'express'
import hourlyRateController from '../controllers/hourlyRate.controller'



const hourlyRateRouter = express.Router()

hourlyRateRouter.put('/', hourlyRateController.update )

export default hourlyRateRouter
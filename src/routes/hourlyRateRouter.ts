import express from 'express'
import hourlyRateController from '../controllers/hourlyRateController'



const hourlyRateRouter = express.Router()

hourlyRateRouter.put('/', hourlyRateController.update )

export default hourlyRateRouter
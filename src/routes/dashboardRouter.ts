import express from 'express'
import dashBoardController from '../controllers/dashboardController'

const dashboardRouter = express.Router()

dashboardRouter.post('/overview', dashBoardController.overview)

export default dashboardRouter

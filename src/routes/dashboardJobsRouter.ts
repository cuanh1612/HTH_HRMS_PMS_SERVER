import express from 'express'
import dashBoardJobsController from '../controllers/dashboardJobsController'
import { checkAuth } from '../utils/middleware/checkAuth'

const dashboardJobsRouter = express.Router()

dashboardJobsRouter.get('/open-jobs', checkAuth(['Admin']), dashBoardJobsController.openJobs)
dashboardJobsRouter.get('/application-sources', checkAuth(['Admin']), dashBoardJobsController.applicationSources)
dashboardJobsRouter.get('/application-status', checkAuth(['Admin']), dashBoardJobsController.applicationStatus)
dashboardJobsRouter.get('/new-interview', checkAuth(['Admin']), dashBoardJobsController.newInterview)
dashboardJobsRouter.get('/today-interview', checkAuth(['Admin']), dashBoardJobsController.todayInterview)
dashboardJobsRouter.get('/today-interview-calendar', checkAuth(['Admin']), dashBoardJobsController.todayInterviewCalendar)
dashboardJobsRouter.get('/total-applications', checkAuth(['Admin']), dashBoardJobsController.totalApplications)
dashboardJobsRouter.get('/total-hired', checkAuth(['Admin']), dashBoardJobsController.totalHired)
dashboardJobsRouter.get('/total-openings', checkAuth(['Admin']), dashBoardJobsController.totalOpenings)
dashboardJobsRouter.get('/total-rejected', checkAuth(['Admin']), dashBoardJobsController.totalRejected)

export default dashboardJobsRouter
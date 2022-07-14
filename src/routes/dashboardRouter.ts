import express from 'express'
import dashBoardController from '../controllers/dashboardController'
import { checkAuth } from '../utils/middleware/checkAuth'

const dashboardRouter = express.Router()

dashboardRouter.get('/pending-tasks', checkAuth(['Admin']), dashBoardController.pendingTasks)
dashboardRouter.get('/total-clients', checkAuth(['Admin']), dashBoardController.totalClients)
dashboardRouter.get('/total-employees', checkAuth(['Admin']), dashBoardController.totalEmployees)
dashboardRouter.get('/total-projects', checkAuth(['Admin']), dashBoardController.totalProjects)
dashboardRouter.get('/today-attendance', checkAuth(['Admin']), dashBoardController.todayAttendance)
dashboardRouter.get('/pending-tasks-raw', checkAuth(['Admin']), dashBoardController.pendingTasksRaw)
dashboardRouter.get('/pending-leaves-raw', checkAuth(['Admin']), dashBoardController.pendingLeavesRaw)
dashboardRouter.get('/hours-logged', checkAuth(['Admin']), dashBoardController.hoursLogged)
dashboardRouter.get('/status-wise-projects', checkAuth(['Admin']), dashBoardController.statusWiseProjects)
dashboardRouter.get('/contracts-generated', checkAuth(['Admin']), dashBoardController.contractsGenerated)
dashboardRouter.get('/pending-milestone', checkAuth(['Admin']), dashBoardController.pendingMilestone)
dashboardRouter.get('/contracts-signed', checkAuth(['Admin']), dashBoardController.contractsSigned)
dashboardRouter.get('/client-wise-earnings', checkAuth(['Admin']), dashBoardController.clientWiseEarnings)
dashboardRouter.get('/client-wise-time-logs', checkAuth(['Admin']), dashBoardController.clientWiseTimeLogs)
dashboardRouter.get('/lastest-clients', checkAuth(['Admin']), dashBoardController.latestClients)
dashboardRouter.get('/projects-earning', checkAuth(['Admin']), dashBoardController.sumEarningLoggedProjects)
dashboardRouter.get('/projects-hours-logged', checkAuth(['Admin']), dashBoardController.sumHoursLoggedProjects)
dashboardRouter.get('/count-by-date-attendance', checkAuth(['Admin']), dashBoardController.countByDateAttendance)
dashboardRouter.get('/count-by-date-leave', checkAuth(['Admin']), dashBoardController.countByDateLeave)
dashboardRouter.get('/count-project-overdue', checkAuth(['Admin']), dashBoardController.countProjectsOverdue)
dashboardRouter.get('/late-attendance', checkAuth(['Admin']), dashBoardController.lateAttendance)

export default dashboardRouter

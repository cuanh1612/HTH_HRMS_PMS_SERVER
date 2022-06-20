import express from 'express'
import dashBoardController from '../controllers/dashboardController'

const dashboardRouter = express.Router()

dashboardRouter.get('/pending-tasks', dashBoardController.pendingTasks)
dashboardRouter.get('/total-clients', dashBoardController.totalClients)
dashboardRouter.get('/total-employees', dashBoardController.totalEmployees)
dashboardRouter.get('/total-projects', dashBoardController.totalProjects)
dashboardRouter.get('/today-attendance', dashBoardController.todayAttendance)
dashboardRouter.get('/pending-tasks-raw', dashBoardController.pendingTasksRaw)
dashboardRouter.get('/pending-leaves-raw', dashBoardController.pendingLeavesRaw)
dashboardRouter.get('/hours-logged', dashBoardController.hoursLogged)
dashboardRouter.get('/status-wise-projects', dashBoardController.statusWiseProjects)
dashboardRouter.get('/contracts-generated', dashBoardController.contractsGenerated)
dashboardRouter.get('/pending-milestone', dashBoardController.pendingMilestone)
dashboardRouter.get('/contracts-signed', dashBoardController.contractsSigned)
dashboardRouter.get('/client-wise-earnings', dashBoardController.clientWiseEarnings)
dashboardRouter.get('/client-wise-time-logs', dashBoardController.clientWiseTimeLogs)
dashboardRouter.get('/lastest-clients', dashBoardController.lastestClients)
dashboardRouter.get('/projects-earning', dashBoardController.sumEarningLoggedProjects)
dashboardRouter.get('/projects-hours-logged', dashBoardController.sumHoursLoggedProjects)
dashboardRouter.get('/count-by-date-attendance', dashBoardController.countBydateAttendance)
dashboardRouter.get('/count-by-date-leave', dashBoardController.countBydateLeave)
dashboardRouter.get('/count-project-overdue', dashBoardController.countProjectsOverdue)
dashboardRouter.get('/late-attendance', dashBoardController.lateAttendance)

export default dashboardRouter

import express from 'express'
import dashBoardController from '../controllers/dashboardController'

const dashboardRouter = express.Router()

dashboardRouter.get('/pendingTasks', dashBoardController.pendingTasks)
dashboardRouter.get('/totalClients', dashBoardController.totalClients)
dashboardRouter.get('/totalEmployees', dashBoardController.totalEmployees)
dashboardRouter.get('/totalProjects', dashBoardController.totalProjects)
dashboardRouter.get('/todayAttendance', dashBoardController.todayAttendance)
dashboardRouter.get('/pendingTasksRaw', dashBoardController.pendingTasksRaw)
dashboardRouter.get('/pendingLeavesRaw', dashBoardController.pendingLeavesRaw)
dashboardRouter.get('/hoursLogged', dashBoardController.hoursLogged)
dashboardRouter.get('/statusWiseProjects', dashBoardController.statusWiseProjects)
dashboardRouter.get('/contractsGenerated', dashBoardController.contractsGenerated)
dashboardRouter.get('/pendingMilestone', dashBoardController.pendingMilestone)
dashboardRouter.get('/contractsSigned', dashBoardController.contractsSigned)
dashboardRouter.get('/clientWiseEarnings', dashBoardController.clientWiseEarnings)
dashboardRouter.get('/clientWiseTimeLogs', dashBoardController.clientWiseTimeLogs)
dashboardRouter.get('/lastestClients', dashBoardController.lastestClients)

export default dashboardRouter

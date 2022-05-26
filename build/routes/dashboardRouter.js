"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = __importDefault(require("../controllers/dashboardController"));
const dashboardRouter = express_1.default.Router();
dashboardRouter.get('/pendingTasks', dashboardController_1.default.pendingTasks);
dashboardRouter.get('/totalClients', dashboardController_1.default.totalClients);
dashboardRouter.get('/totalEmployees', dashboardController_1.default.totalEmployees);
dashboardRouter.get('/totalProjects', dashboardController_1.default.totalProjects);
dashboardRouter.get('/todayAttendance', dashboardController_1.default.todayAttendance);
dashboardRouter.get('/pendingTasksRaw', dashboardController_1.default.pendingTasksRaw);
dashboardRouter.get('/pendingLeavesRaw', dashboardController_1.default.pendingLeavesRaw);
dashboardRouter.get('/hoursLogged', dashboardController_1.default.hoursLogged);
exports.default = dashboardRouter;

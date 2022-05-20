"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Attendance_1 = require("../entities/Attendance");
const Client_1 = require("../entities/Client");
const Employee_1 = require("../entities/Employee");
const Leave_1 = require("../entities/Leave");
const Project_1 = require("../entities/Project");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const dashBoardController = {
    overview: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const countClients = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const value = yield Client_1.Client.createQueryBuilder('client').getCount();
            if (value)
                resolve(value);
            reject();
        }));
        const countEmployees = yield Employee_1.Employee.createQueryBuilder('employee').getCount();
        const countProjects = yield Project_1.Project.createQueryBuilder('project').getCount();
        const countAttendancesToday = yield Attendance_1.Attendance.createQueryBuilder('attendance')
            .where('attendance.date = :date', {
            date: new Date(),
        })
            .getCount();
        const pendingLeaves = yield Leave_1.Leave.find({
            where: {
                status: 'Pending',
            },
        });
        // const pendingTasks = await Task.find({
        // 	where: {
        // 		status: 'Incomplete' || 'To Do' || 'Doing' || 'Completed',
        // 	},
        // })
        const overview = {
            countClients,
            countEmployees,
            countProjects,
            countAttendancesToday,
            pendingLeaves,
            // pendingTasks,np
        };
        return res.status(200).json({
            code: 200,
            success: true,
            overview,
            message: 'Get overview dashboard successfully',
        });
    })),
    project: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const countProjects = yield Project_1.Project.createQueryBuilder('project').getCount();
        const countOverdueProjects = yield Project_1.Project.createQueryBuilder('project')
            .where('project.project_status = :project_status', {
            project_status: 'Not Started' || 'In Progress' || 'On Hold' || 'Canceled',
        })
            .getCount();
        const dashboardProject = {
            countProjects,
            countOverdueProjects,
        };
        return res.status(200).json({
            code: 200,
            success: true,
            dashboardProject,
            message: 'Get project dashboard successfully',
        });
    })),
};
exports.default = dashBoardController;

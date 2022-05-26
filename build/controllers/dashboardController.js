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
const typeorm_1 = require("typeorm");
const Attendance_1 = require("../entities/Attendance");
const Client_1 = require("../entities/Client");
const Employee_1 = require("../entities/Employee");
const Leave_1 = require("../entities/Leave");
const Project_1 = require("../entities/Project");
const Task_1 = require("../entities/Task");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const dashBoardController = {
    totalClients: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const totalClients = yield Client_1.Client.createQueryBuilder('client').getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalClients,
            message: 'Get total clients successfully',
        });
    })),
    totalEmployees: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const totalEmployees = yield Employee_1.Employee.createQueryBuilder('employee').getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalEmployees,
            message: 'Get total employees successfully',
        });
    })),
    totalProjects: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const totalProjects = yield Project_1.Project.createQueryBuilder('project').getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            totalProjects,
            message: 'Get total projects successfully',
        });
    })),
    // hoursLogged: handleCatchError(async (_: Request, res: Response) => {
    // 	const hoursLogged = await Project.createQueryBuilder('project').getCount()
    // 	return res.status(200).json({
    // 		code: 200,
    // 		success: true,
    // 		hoursLogged,
    // 		message: 'Get hours logged successfully',
    // 	})
    // }),
    pendingTasks: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pendingTasks = yield Task_1.Task.createQueryBuilder('task')
            .leftJoinAndSelect('task.status', 'status')
            .where('status.title != :title', { title: 'Complete' })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            pendingTasks,
            message: 'Get pending tasks successfully',
        });
    })),
    todayAttendance: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const todayAttendance = yield Attendance_1.Attendance.createQueryBuilder('attendance')
            .where('attendance.date = :date', { date: new Date().toLocaleDateString() })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            todayAttendance,
            message: 'Get today attendance successfully',
        });
    })),
    pendingTasksRaw: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pendingTasksRaw = yield Task_1.Task.createQueryBuilder('task')
            .leftJoinAndSelect('task.status', 'status')
            .where('status.title != :title', { title: 'Complete' })
            .getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            pendingTasksRaw,
            message: 'Get pending tasks successfully',
        });
    })),
    pendingLeavesRaw: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pendingLeavesRaw = yield Leave_1.Leave.createQueryBuilder('leave')
            .where('leave.status != :status', { status: 'Pending' })
            .getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            pendingLeavesRaw,
            message: 'Get pending leaves successfully',
        });
    })),
    hoursLogged: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const hoursLogged = (yield manager.query('SELECT SUM(time_log.total_hours) as sum_total_hours FROM time_log')) || 0;
        return res.status(200).json({
            code: 200,
            success: true,
            hoursLogged: Number(hoursLogged[0].sum_total_hours) || 0,
            message: 'Get pending leaves successfully',
        });
    })),
};
exports.default = dashBoardController;

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
const Contract_1 = require("../entities/Contract");
const Employee_1 = require("../entities/Employee");
const Milestone_1 = require("../entities/Milestone");
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
    sumHoursLoggedProjects: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const sumHoursLoggedProjects = yield manager.query('SELECT "project"."id", "project"."name", SUM("time_log"."total_hours") from "time_log" LEFT JOIN "project" on "time_log"."projectId" = "project"."id" GROUP BY "project"."id"');
        return res.status(200).json({
            code: 200,
            success: true,
            sumHoursLoggedProjects: sumHoursLoggedProjects,
            message: 'Get sum Hours Logged Projects successfully',
        });
    })),
    sumEarningLoggedProjects: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const sumEarningLoggedProjects = yield manager.query('SELECT "project"."id", "project"."name", SUM("time_log"."earnings") from "time_log" LEFT JOIN "project" on "time_log"."projectId" = "project"."id" GROUP BY "project"."id"');
        return res.status(200).json({
            code: 200,
            success: true,
            sumEarningLoggedProjects,
            message: 'Get sum Hours Logged Projects successfully',
        });
    })),
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
        //Get end date last month
        const dateLastMonth = new Date();
        dateLastMonth.setDate(1);
        dateLastMonth.setDate(dateLastMonth.getDate() - 1);
        const pendingTasksRaw = yield Task_1.Task.createQueryBuilder('task')
            .leftJoinAndSelect('task.status', 'status')
            .leftJoinAndSelect('task.assignBy', 'emlpoyee')
            .leftJoinAndSelect('task.project', 'project')
            .where('status.title != :title', { title: 'Complete' })
            .andWhere('task.start_date > :date', { date: dateLastMonth })
            .getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            pendingTasksRaw,
            message: 'Get pending tasks successfully',
        });
    })),
    pendingLeavesRaw: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        //Get end date last month
        const dateLastMonth = new Date();
        dateLastMonth.setDate(1);
        dateLastMonth.setDate(dateLastMonth.getDate() - 1);
        const manager = (0, typeorm_1.getManager)('huprom');
        const pendingLeavesRaw = yield manager.query(`SELECT * from "public"."leave" LEFT JOIN "public"."employee" ON "public"."leave"."employeeId" = "public"."employee"."id" LEFT JOIN "public"."avatar" ON "public"."employee"."avatarId" = "public"."avatar"."id" WHERE "public"."leave"."status" = 'Pending' AND "public"."leave"."date" > '${dateLastMonth.getFullYear()}-${dateLastMonth.getMonth() + 1}-${dateLastMonth.getDate()}'`);
        return res.status(200).json({
            code: 200,
            success: true,
            pendingLeavesRaw,
            message: 'Get pending leaves successfully',
        });
    })),
    hoursLogged: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const hoursLogged = yield manager.query('SELECT SUM(time_log.total_hours) as sum_total_hours FROM time_log');
        return res.status(200).json({
            code: 200,
            success: true,
            hoursLogged: Number(hoursLogged[0].sum_total_hours) || 0,
            message: 'Get pending leaves successfully',
        });
    })),
    statusWiseProjects: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const statusWiseProjects = yield manager.query('SELECT COUNT(project.id), project.project_status FROM project GROUP BY project.project_status');
        return res.status(200).json({
            code: 200,
            success: true,
            statusWiseProjects: statusWiseProjects,
            message: 'Get status wise projects successfully',
        });
    })),
    pendingMilestone: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const statusWiseProjects = yield Milestone_1.Milestone.find({
            where: {
                status: false,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            statusWiseProjects: statusWiseProjects,
            message: 'Get status wise projects successfully',
        });
    })),
    contractsGenerated: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const contractsGenerated = yield Contract_1.Contract.createQueryBuilder('contract').getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            contractsGenerated: contractsGenerated,
            message: 'Get contracts generated successfully',
        });
    })),
    contractsSigned: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const contractsSigned = yield manager.query('SELECT COUNT(contract.id) FROM contract WHERE contract."signId" NOTNULL');
        return res.status(200).json({
            code: 200,
            success: true,
            contractsSigned: Number(contractsSigned[0].count) || 0,
            message: 'Get contracts signed successfully',
        });
    })),
    clientWiseEarnings: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const clientWiseEarnings = yield manager.query('SELECT SUM(time_log.earnings) as earnings, client.name, client.id FROM time_log, project, client WHERE time_log."projectId" = project.id AND project."clientId" = client.id GROUP BY client.id');
        return res.status(200).json({
            code: 200,
            success: true,
            clientWiseEarnings: clientWiseEarnings,
            message: 'Get client wise earnings successfully',
        });
    })),
    clientWiseTimeLogs: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const clientWiseTimeLogs = yield manager.query('SELECT SUM(time_log.total_hours) as total_hours, client.name, client.id FROM time_log, project, client WHERE time_log."projectId" = project.id AND project."clientId" = client.id GROUP BY client.id');
        return res.status(200).json({
            code: 200,
            success: true,
            clientWiseTimeLogs: clientWiseTimeLogs,
            message: 'Get client wise time logs successfully',
        });
    })),
    lastestClients: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const lastestClients = yield Client_1.Client.createQueryBuilder('client').limit(10).getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            lastestClients: lastestClients,
            message: 'Get lastest clients successfully',
        });
    })),
    lateAttendance: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const lastestClients = yield Client_1.Client.createQueryBuilder('client').limit(10).getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            lastestClients: lastestClients,
            message: 'Get lastest clients successfully',
        });
    })),
};
exports.default = dashBoardController;

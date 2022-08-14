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
const Project_1 = require("../entities/Project");
const Task_1 = require("../entities/Task");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const helper_1 = require("../utils/helper");
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
        const sumHoursLoggedProjects = yield manager.query('SELECT "project"."id", "project"."name", SUM("time_log"."total_hours") from "time_log" LEFT JOIN "project" on "time_log"."projectId" = "project"."id" GROUP BY "project"."id" LIMIT 10');
        return res.status(200).json({
            code: 200,
            success: true,
            sumHoursLoggedProjects: sumHoursLoggedProjects,
            message: 'Get sum Hours Logged Projects successfully',
        });
    })),
    sumEarningLoggedProjects: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const sumEarningLoggedProjects = yield manager.query('SELECT "project"."id", "project"."name", SUM("time_log"."earnings") from "time_log" LEFT JOIN "project" on "time_log"."projectId" = "project"."id" GROUP BY "project"."id" LIMIT 10');
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
            .where('attendance.date = :date', { date: new Date() })
            .getCount();
        return res.status(200).json({
            code: 200,
            success: true,
            todayAttendance,
            message: 'Get today attendance successfully',
        });
    })),
    pendingTasksRaw: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTime, lastTime } = (0, helper_1.getSETime)(new Date(req.query.date));
        const pendingTasksRaw = yield Task_1.Task.createQueryBuilder('task')
            .leftJoinAndSelect('task.status', 'status')
            .leftJoinAndSelect('task.assignBy', 'employee')
            .leftJoinAndSelect('task.project', 'project')
            .where('status.title != :title', { title: 'Complete' })
            .andWhere('task.start_date >= :date and task.start_date <= :date2', {
            date: firstTime,
            date2: lastTime,
        })
            .getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            pendingTasksRaw,
            message: 'Get pending tasks successfully',
        });
    })),
    pendingLeavesRaw: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTime } = (0, helper_1.getSETime)(new Date(req.query.date));
        const manager = (0, typeorm_1.getManager)('huprom');
        const pendingLeavesRaw = yield manager.query(`SELECT *,"leave_type"."name" as leave_type_name, "leave"."id" as leave_id, "employee"."name" as employee_name, "avatar"."name" as avatar_name from "leave" LEFT JOIN "leave_type" ON "leave"."leaveTypeId" = "leave_type"."id" LEFT JOIN "employee" ON "leave"."employeeId" = "employee"."id" LEFT JOIN "avatar" ON "employee"."avatarId" = "avatar"."id" WHERE "leave"."date" >='${firstTime}'  and "leave"."status" = 'Pending'`);
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
    pendingMilestone: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTime, lastTime } = (0, helper_1.getSETime)(new Date(req.query.date));
        const manager = (0, typeorm_1.getManager)('huprom');
        const pendingMilestone = yield manager.query(`SELECT * FROM "public"."milestone" LEFT JOIN "public"."project" ON "public"."milestone"."projectId" = "public"."project"."id" WHERE "public"."milestone"."status" IS FALSE and milestone.created_at >= '${firstTime}' and milestone.created_at <= '${lastTime}'`);
        return res.status(200).json({
            code: 200,
            success: true,
            pendingMilestone,
            message: 'Get pending milestones successfully',
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
    clientWiseEarnings: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTime, lastTime } = (0, helper_1.getSETime)(new Date(req.query.date));
        const manager = (0, typeorm_1.getManager)('huprom');
        const clientWiseEarnings = yield manager.query(`SELECT SUM(time_log.earnings) as earnings, client.name, client.id FROM time_log, project, client WHERE time_log."projectId" = project.id AND project."clientId" = client.id and time_log.starts_on_date >= '${firstTime}' and time_log.starts_on_date <= '${lastTime}' GROUP BY client.id`);
        return res.status(200).json({
            code: 200,
            success: true,
            clientWiseEarnings: clientWiseEarnings,
            message: 'Get client wise earnings successfully',
        });
    })),
    clientWiseTimeLogs: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTime, lastTime } = (0, helper_1.getSETime)(new Date(req.query.date));
        const manager = (0, typeorm_1.getManager)('huprom');
        const clientWiseTimeLogs = yield manager.query(`SELECT SUM(time_log.total_hours) as total_hours, client.name, client.id FROM time_log, project, client WHERE time_log."projectId" = project.id AND project."clientId" = client.id and time_log.starts_on_date >= '${firstTime}' and time_log.starts_on_date <= '${lastTime}' GROUP BY client.id`);
        return res.status(200).json({
            code: 200,
            success: true,
            clientWiseTimeLogs: clientWiseTimeLogs,
            message: 'Get client wise time logs successfully',
        });
    })),
    latestClients: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTimeDate, lastTimeDate } = (0, helper_1.getSETime)(new Date(req.query.date));
        const data = yield Client_1.Client.createQueryBuilder('client').getMany();
        const latestClients = data.filter((client) => {
            if (new Date(client.createdAt).getTime() >= firstTimeDate.getTime() &&
                new Date(client.createdAt).getTime() <= lastTimeDate.getTime())
                return true;
            return false;
        });
        return res.status(200).json({
            code: 200,
            success: true,
            lastestClients: latestClients.length > 10 ? latestClients.slice(0, 10) : latestClients,
            message: 'Get lastest clients successfully',
        });
    })),
    lateAttendance: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const latestClients = yield Client_1.Client.createQueryBuilder('client').limit(10).getMany();
        return res.status(200).json({
            code: 200,
            success: true,
            lastestClients: latestClients,
            message: 'Get lastest clients successfully',
        });
    })),
    countByDateAttendance: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTime, lastTime, lastDate } = (0, helper_1.getSETime)(new Date(req.query.date));
        const manager = (0, typeorm_1.getManager)('huprom');
        const currentMonthAttendance = (yield manager.query(`SELECT * FROM "attendance" WHERE "attendance"."date" >= '${firstTime}' and "attendance"."date" <= '${lastTime}'`)) || [];
        const countByDateAttendance = [];
        //Count attendance by date
        for (let index = 1; index <= lastDate; index++) {
            let countAttendance = 0;
            currentMonthAttendance.map((attendance) => {
                const dateAttendance = new Date(attendance.date).getDate();
                if (dateAttendance === index) {
                    countAttendance++;
                }
            });
            countByDateAttendance.push({
                count: countAttendance,
                date: index,
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            countBydateAttendance: countByDateAttendance,
            message: 'Get count by date attendance successfully',
        });
    })),
    countByDateLeave: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { firstTime, lastTime, lastDate } = (0, helper_1.getSETime)(new Date(req.query.date));
        const manager = (0, typeorm_1.getManager)('huprom');
        const currentMonthLeave = (yield manager.query(`SELECT * FROM "leave" WHERE "leave"."date" >= '${firstTime}' and "leave"."date" <= '${lastTime}'`)) || [];
        const countByLeaveAttendance = [];
        //Count attendance by date
        for (let index = 1; index <= lastDate; index++) {
            let countAttendance = 0;
            currentMonthLeave.map((leave) => {
                const dateLeave = new Date(leave.date).getDate();
                if (dateLeave === index) {
                    countAttendance++;
                }
            });
            countByLeaveAttendance.push({
                count: countAttendance,
                date: index,
            });
        }
        return res.status(200).json({
            code: 200,
            success: true,
            countByLeaveAttendance: countByLeaveAttendance,
            message: 'Get count by date leave successfully',
        });
    })),
    countProjectsOverdue: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const manager = (0, typeorm_1.getManager)('huprom');
        const countProjectsOverdue = yield manager.query('SELECT COUNT("project"."id") FROM "project" WHERE "project"."deadline" < CURRENT_DATE');
        return res.status(200).json({
            code: 200,
            success: true,
            countProjectsOverdue: countProjectsOverdue && countProjectsOverdue[0]
                ? Number(countProjectsOverdue[0].count)
                : 0,
            message: 'Get count project overdue successfully',
        });
    })),
};
exports.default = dashBoardController;

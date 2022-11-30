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
const jsonwebtoken_1 = require("jsonwebtoken");
const Employee_entity_1 = require("../entities/Employee.entity");
const Hourly_rate_project_entity_1 = require("../entities/Hourly_rate_project.entity");
const Notification_entity_1 = require("../entities/Notification.entity");
const Project_entity_1 = require("../entities/Project.entity");
const Task_entity_1 = require("../entities/Task.entity");
const Time_Log_entity_1 = require("../entities/Time_Log.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const helper_1 = require("../utils/helper");
const timeLogValid_1 = require("../utils/valid/timeLogValid");
const timeLogController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewTimeLog = req.body;
        const { project, task, employee, starts_on_date, ends_on_date } = dataNewTimeLog;
        //check exist current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check valid input create new project
        //Check valid
        const messageValid = timeLogValid_1.timeLogValid.createOrUpdate(dataNewTimeLog);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: project,
            },
            relations: {
                project_Admin: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        if (existingUser.role !== 'Admin' &&
            existingProject.project_Admin.email !== existingUser.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this operation',
            });
        //Check existing task
        const existingTask = yield Task_entity_1.Task.findOne({
            where: {
                id: task,
            },
            relations: {
                employees: true,
            },
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: employee,
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Check employee  assign to task and project
        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id) ||
            !existingProject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not assigned to task or project',
            });
        }
        //Create time log
        const newTimeLog = yield Time_Log_entity_1.Time_log.create(Object.assign(Object.assign({}, dataNewTimeLog), { starts_on_date: new Date(dataNewTimeLog.starts_on_date), ends_on_date: new Date(dataNewTimeLog.ends_on_date), project: existingProject, task: existingTask, employee: existingEmployee })).save();
        //Get time log created
        const createdTimeLog = (yield Time_Log_entity_1.Time_log.findOne({
            where: {
                id: newTimeLog.id,
            },
        }));
        //Get total hours
        const dateOneObj = new Date(starts_on_date);
        const dateTwoObj = new Date(ends_on_date);
        const dateOneObjTime = new Date(`${dateOneObj.getMonth() + 1}-${dateOneObj.getDate()}-${dateOneObj.getFullYear()} ${createdTimeLog.starts_on_time}`);
        const dateTwoObjTime = new Date(`${dateTwoObj.getMonth() + 1}-${dateTwoObj.getDate()}-${dateTwoObj.getFullYear()} ${createdTimeLog.ends_on_time}`);
        const milliseconds = Math.abs(dateTwoObjTime.getTime() - dateOneObjTime.getTime());
        const totalHours = Math.round(milliseconds / 1000 / 3600);
        //Update total hours
        createdTimeLog.total_hours = totalHours;
        //Get total earning
        const existingHourlyRate = yield Hourly_rate_project_entity_1.Hourly_rate_project.findOne({
            where: {
                employee: {
                    id: existingEmployee.id,
                },
                project: {
                    id: existingProject.id,
                },
            },
        });
        if (existingHourlyRate) {
            createdTimeLog.earnings = existingHourlyRate.hourly_rate * totalHours;
        }
        //Save update earning
        yield createdTimeLog.save();
        //Create notification
        yield Notification_entity_1.Notification.create({
            employee: existingEmployee,
            url: `/projects/${existingProject.id}/time-logs-table`,
            content: 'You have just been assigned to a new time log',
        }).save();
        //Crete activity for project
        yield (0, helper_1.CreateProjectActivity)(res, existingProject.id, 'New Time Log Added To The Project');
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new task files success',
            // timeLog: createdTimeLog,
        });
    })),
    //update timelog
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { timeLogId } = req.params;
        const dataUpdateTimeLog = req.body;
        const { project, task, employee, starts_on_date, ends_on_date, starts_on_time, ends_on_time, } = dataUpdateTimeLog;
        //check exist current user
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check valid input create new project
        const messageValid = timeLogValid_1.timeLogValid.createOrUpdate(dataUpdateTimeLog);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: project,
            },
            relations: {
                project_Admin: true,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        if (existingUser.role !== 'Admin' &&
            existingProject.project_Admin.email !== existingUser.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this operation',
            });
        //Check existing task
        const existingTask = yield Task_entity_1.Task.findOne({
            where: {
                id: task,
            },
            relations: {
                employees: true,
            },
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: employee,
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Check employee  assign to task and project
        if (!existingProject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id) ||
            !existingProject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not assigned to task or project',
            });
        }
        //Check existing time log
        const existingTimeLog = yield Time_Log_entity_1.Time_log.findOne({
            where: {
                id: Number(timeLogId),
            },
        });
        if (!existingTimeLog)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Time log does not exist in the system',
            });
        existingTimeLog.starts_on_time = starts_on_time;
        existingTimeLog.ends_on_time = ends_on_time;
        //Get total hours
        const dateOneObj = new Date(starts_on_date);
        const dateTwoObj = new Date(ends_on_date);
        const dateOneObjTime = new Date(`${dateOneObj.getMonth() + 1}-${dateOneObj.getDate()}-${dateOneObj.getFullYear()} ${existingTimeLog.starts_on_time}`);
        const dateTwoObjTime = new Date(`${dateTwoObj.getMonth() + 1}-${dateTwoObj.getDate()}-${dateTwoObj.getFullYear()} ${existingTimeLog.ends_on_time}`);
        const milliseconds = Math.abs(dateTwoObjTime.getTime() - dateOneObjTime.getTime());
        const totalHours = Math.round(milliseconds / 1000 / 3600);
        //Update total hours
        existingTimeLog.total_hours = totalHours;
        //Get total earning
        const existingHourlyRate = yield Hourly_rate_project_entity_1.Hourly_rate_project.findOne({
            where: {
                employee: {
                    id: existingEmployee.id,
                },
                project: {
                    id: existingProject.id,
                },
            },
        });
        if (existingHourlyRate) {
            existingTimeLog.earnings = existingHourlyRate.hourly_rate * totalHours;
        }
        existingTimeLog.project = existingProject;
        existingTimeLog.task = task;
        existingTimeLog.memo = dataUpdateTimeLog.memo;
        existingTimeLog.employee = existingEmployee;
        existingTimeLog.starts_on_date = new Date(dataUpdateTimeLog.starts_on_date);
        existingTimeLog.ends_on_date = new Date(dataUpdateTimeLog.ends_on_date);
        //Save update
        yield existingTimeLog.save();
        //Check existing project
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated time log successfully',
        });
    })),
    //delete timelog
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { timeLogId } = req.params;
        //check exist current user
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //Check existing timelog
        const existingTimeLog = yield Time_Log_entity_1.Time_log.findOne({
            where: {
                id: Number(timeLogId),
            },
            relations: {
                project: {
                    project_Admin: true,
                },
            },
        });
        if (!existingTimeLog)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Time log does not assigned to task or project',
            });
        if (existingUser.role !== 'Admin' &&
            existingTimeLog.project.project_Admin.email !== existingUser.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this operation',
            });
        //Delete
        yield existingTimeLog.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted time log successfully',
        });
    })),
    getAllByProject: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        //check exist current user
        const token = (_d = req.headers.authorization) === null || _d === void 0 ? void 0 : _d.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decode)
            return res.status(400).json({
                code: 401,
                success: false,
                message: 'Please login first',
            });
        const { projectId } = req.params;
        //Check exist project
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Create filter
        var filter = {};
        if (existingProject)
            filter.project = {
                id: Number(existingProject.id),
            };
        if (decode.role === 'Employee')
            filter.employee = {
                id: Number(decode.userId),
            };
        const timeLogs = yield Time_Log_entity_1.Time_log.find({
            where: filter,
            order: {
                createdAt: 'DESC',
            },
            relations: {
                task: {
                    status: true,
                },
                employee: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Deleted time log successfully',
        });
    })),
    deleteMany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _e;
        const { timelogs } = req.body;
        //check exist current user
        const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = yield Employee_entity_1.Employee.findOne({
            where: {
                id: decode.userId,
            },
        });
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        //check array of timelog
        if (!Array.isArray(timelogs) || !timelogs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Timelog does not exist in the system',
            });
        yield Promise.all(timelogs.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const existingTimeLog = yield Time_Log_entity_1.Time_log.findOne({
                    where: {
                        id: id,
                    },
                    relations: {
                        project: {
                            project_Admin: true,
                        },
                    },
                });
                if (existingTimeLog) {
                    //Check role admin or projectt admin
                    if (existingUser.role !== 'Admin' &&
                        existingTimeLog.project.project_Admin.email !== existingUser.email)
                        return res.status(400).json({
                            code: 400,
                            success: false,
                            message: 'You do not have permission to perform this operation',
                        });
                    yield existingTimeLog.remove();
                }
                return resolve(true);
            }));
        })));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete timelogs success',
        });
    })),
    // get all time logs and show in calendar
    calendar: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employee, client, project } = req.query;
        var filter = {};
        if (employee)
            filter.task = {
                employees: {
                    id: Number(employee),
                },
            };
        if (project)
            filter.project = Object.assign(Object.assign({}, filter.project), { id: project });
        if (client)
            filter.project = Object.assign(Object.assign({}, filter.project), { client: {
                    id: client,
                } });
        const timeLogs = yield Time_Log_entity_1.Time_log.find({
            where: filter,
            relations: {
                task: {
                    status: true,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Get all projects success',
        });
    })),
    // get all time logs and show in calendar
    calendarByEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { client, project } = req.query;
        const { employeeId } = req.params;
        //Check exist employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId),
            },
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not exist in the system',
            });
        //Check exist employee
        var filter = {};
        filter.employee = {
            id: Number(existingEmployee.id),
        };
        if (project)
            filter.project = Object.assign(Object.assign({}, filter.project), { id: project });
        if (client)
            filter.project = Object.assign(Object.assign({}, filter.project), { client: {
                    id: client,
                } });
        const timeLogs = yield Time_Log_entity_1.Time_log.find({
            where: filter,
            relations: {
                task: {
                    status: true,
                },
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Get all projects success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const timeLogs = yield Time_Log_entity_1.Time_log.find({
            order: {
                createdAt: 'DESC',
            },
            relations: {
                task: {
                    status: true,
                },
                employee: true,
                project: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Get all timelog success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { timelogId } = req.params;
        const existingTimelog = yield Time_Log_entity_1.Time_log.findOne({
            where: {
                id: Number(timelogId),
            },
            relations: {
                project: true,
                employee: true,
                task: true,
            },
        });
        if (!existingTimelog)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Timelog does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLog: existingTimelog,
            message: 'Get detail of timelog success',
        });
    })),
    getByCurrentUser: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _f;
        //check exist current user
        const token = (_f = req.headers.authorization) === null || _f === void 0 ? void 0 : _f.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decode)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        var filter = {};
        if (decode.role === 'Employee') {
            filter.employee = {
                id: decode.userId,
            };
        }
        const timeLogs = yield Time_Log_entity_1.Time_log.find({
            order: {
                createdAt: 'DESC',
            },
            relations: {
                task: {
                    status: true,
                },
                employee: true,
                project: true,
            },
            where: filter,
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Get all timelog success',
        });
    })),
    getByEmployee: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { employeeId } = req.params;
        //Check existing employee
        const existingEmployee = yield Employee_entity_1.Employee.findOne({
            where: {
                id: Number(employeeId)
            }
        });
        if (!existingEmployee)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Not found employee to get timelogs',
            });
        //Get timelogs by employee
        const timeLogs = yield Time_Log_entity_1.Time_log.find({
            order: {
                createdAt: 'DESC',
            },
            relations: {
                task: {
                    status: true,
                },
                employee: true,
                project: true,
            },
            where: {
                employee: {
                    id: existingEmployee.id
                }
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Get all timelog success',
        });
    })),
};
exports.default = timeLogController;

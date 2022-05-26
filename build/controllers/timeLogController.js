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
const Employee_1 = require("../entities/Employee");
const Hourly_rate_project_1 = require("../entities/Hourly_rate_project");
const Project_1 = require("../entities/Project");
const Task_1 = require("../entities/Task");
const Time_Log_1 = require("../entities/Time_Log");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const timeLogValid_1 = require("../utils/valid/timeLogValid");
const timeLogController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewTimeLog = req.body;
        const { project, task, employee, starts_on_date, ends_on_date } = dataNewTimeLog;
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
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check exisiting task
        const existingTask = yield Task_1.Task.findOne({
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
        //Check exisiting employee
        const existingEmployee = yield Employee_1.Employee.findOne({
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
        if (!existingproject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id) ||
            !existingproject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not assigned to task or project',
            });
        }
        //Create time log
        const newTimeLog = yield Time_Log_1.Time_log.create(Object.assign(Object.assign({}, dataNewTimeLog), { project: existingproject, task: existingTask, employee: existingEmployee })).save();
        //Get time log created
        const createdTimeLog = (yield Time_Log_1.Time_log.findOne({
            where: {
                id: newTimeLog.id,
            },
        }));
        //Get total hourse
        const dateOneObj = new Date(starts_on_date);
        const dateTwoObj = new Date(ends_on_date);
        const dateOneObjTime = new Date(`${dateOneObj.getMonth() + 1}-${dateOneObj.getDate()}-${dateOneObj.getFullYear()} ${createdTimeLog.starts_on_time}`);
        const dateTwoObjTime = new Date(`${dateTwoObj.getMonth() + 1}-${dateTwoObj.getDate()}-${dateTwoObj.getFullYear()} ${createdTimeLog.ends_on_time}`);
        const milliseconds = Math.abs(dateTwoObjTime.getTime() - dateOneObjTime.getTime());
        const totalHours = milliseconds / 1000 / 3600;
        //Update total hours
        createdTimeLog.total_hours = totalHours;
        //Get total earning
        const exisingHourlyrate = yield Hourly_rate_project_1.Hourly_rate_project.findOne({
            where: {
                employee: {
                    id: existingEmployee.id,
                },
                project: {
                    id: existingproject.id,
                },
            },
        });
        if (exisingHourlyrate) {
            createdTimeLog.earnings = exisingHourlyrate.hourly_rate * totalHours;
        }
        //Save update earning
        yield createdTimeLog.save();
        //Check existing project
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new task files success',
            // timeLog: createdTimeLog,
        });
    })),
    //update timelog
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { timeLogId } = req.params;
        const dataUpdateTimeLog = req.body;
        const { project, task, employee, starts_on_date, ends_on_date, starts_on_time, ends_on_time } = dataUpdateTimeLog;
        //Check valid input create new project
        const messageValid = timeLogValid_1.timeLogValid.createOrUpdate(dataUpdateTimeLog);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //check exist project
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check exisiting task
        const existingTask = yield Task_1.Task.findOne({
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
        //Check exisiting employee
        const existingEmployee = yield Employee_1.Employee.findOne({
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
        if (!existingproject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id) ||
            !existingproject.employees.some((employeeItem) => employeeItem.id === existingEmployee.id)) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Employee does not assigned to task or project',
            });
        }
        //Check existing time log
        const existingTimeLog = (yield Time_Log_1.Time_log.findOne({
            where: {
                id: Number(timeLogId),
            },
        }));
        if (!existingTimeLog)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Time log does not exist in the system',
            });
        existingTimeLog.starts_on_time = starts_on_time;
        existingTimeLog.ends_on_time = ends_on_time;
        yield existingTimeLog.save();
        //Get time log after update
        const updatedTimeLog = (yield Time_Log_1.Time_log.findOne({
            where: {
                id: Number(timeLogId),
            },
        }));
        //Get total hourse
        const dateOneObj = new Date(starts_on_date);
        const dateTwoObj = new Date(ends_on_date);
        const dateOneObjTime = new Date(`${dateOneObj.getMonth() + 1}-${dateOneObj.getDate()}-${dateOneObj.getFullYear()} ${updatedTimeLog.starts_on_time}`);
        const dateTwoObjTime = new Date(`${dateTwoObj.getMonth() + 1}-${dateTwoObj.getDate()}-${dateTwoObj.getFullYear()} ${updatedTimeLog.ends_on_time}`);
        const milliseconds = Math.abs(dateTwoObjTime.getTime() - dateOneObjTime.getTime());
        const totalHours = milliseconds / 1000 / 3600;
        //Update total hours
        updatedTimeLog.total_hours = totalHours;
        //Get total earning
        const exisingHourlyrate = yield Hourly_rate_project_1.Hourly_rate_project.findOne({
            where: {
                employee: {
                    id: existingEmployee.id,
                },
                project: {
                    id: existingproject.id,
                },
            },
        });
        if (exisingHourlyrate) {
            updatedTimeLog.earnings = exisingHourlyrate.hourly_rate * totalHours;
        }
        updatedTimeLog.project = existingproject;
        updatedTimeLog.task = task;
        updatedTimeLog.memo = dataUpdateTimeLog.memo;
        updatedTimeLog.employee = existingEmployee;
        //Save update 
        yield updatedTimeLog.save();
        //Check existing project
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated time log successfully',
        });
    })),
    //delete timelog
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { timeLogId } = req.params;
        //Check existing timelog
        const existingTimeLog = yield Time_Log_1.Time_log.findOne({
            where: {
                id: Number(timeLogId)
            }
        });
        if (!existingTimeLog)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Time log does not assigned to task or project',
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
        const { projectId } = req.params; // taik biet tieenngs
        //Check exist project
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId)
            }
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        const timeLogs = yield Time_Log_1.Time_log.find({
            where: {
                project: {
                    id: existingproject.id
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLogs,
            message: 'Deleted time log successfully',
        });
    })),
    Deletemany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { timelogs } = req.body;
        //check array of timelog
        if (!Array.isArray(timelogs) || !timelogs)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Timelog does not exist in the system',
            });
        for (let index = 0; index < timelogs.length; index++) {
            const itemtimelog = timelogs[index];
            const existingtimelog = yield Time_Log_1.Time_log.findOne({
                where: {
                    id: itemtimelog.id,
                },
            });
            if (existingtimelog) {
                yield existingtimelog.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete timelogs success',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const timelogs = yield Time_Log_1.Time_log.find();
        return res.status(200).json({
            code: 200,
            success: true,
            timelogs: timelogs,
            message: 'Get all timelog success',
        });
    })),
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { timelogId } = req.params;
        const existingtimelog = yield Time_Log_1.Time_log.findOne({
            where: {
                id: Number(timelogId)
            },
            relations: {
                project: true,
                employee: true,
                task: true
            }
        });
        if (!existingtimelog)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Timelog does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            timeLog: existingtimelog,
            message: 'Get detail of timelog success'
        });
    }))
};
exports.default = timeLogController;

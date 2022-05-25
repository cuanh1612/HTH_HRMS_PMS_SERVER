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
const Project_1 = require("../entities/Project");
const Task_1 = require("../entities/Task");
const Time_Log_1 = require("../entities/Time_Log");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const timeLog_1 = require("../utils/valid/timeLog");
const timeLogController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewTimeLog = req.body;
        const { project, task, employee } = dataNewTimeLog;
        //Check valid input create new project
        //Check valid
        const messageValid = timeLog_1.timeLogValid.createOrUpdate(dataNewTimeLog);
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
        const createdTimeLog = yield Time_Log_1.Time_log.create(Object.assign(Object.assign({}, dataNewTimeLog), { project: existingproject, task: existingTask, employee: existingEmployee })).save();
        //Check existing project
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new task files success',
            timeLog: createdTimeLog,
        });
    })),
};
exports.default = timeLogController;

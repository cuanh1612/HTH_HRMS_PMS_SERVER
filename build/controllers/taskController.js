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
const Task_Category_1 = require("../entities/Task_Category");
const Task_File_1 = require("../entities/Task_File");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const taskValid_1 = require("../utils/valid/taskValid");
// import { Request, Response } from 'express'
// import { createOrUpdateTaskPayload } from '../type/taskPayload copy'
// import handleCatchError from '../utils/catchAsyncError'
// import { taskValid } from '../utils/valid/taskValid copy'
const taskController = {
    //Create new task
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewTask = req.body;
        const { task_category, project, employees, task_files } = dataNewTask;
        let taskEmployees = [];
        //check valid 
        const messageValid = taskValid_1.taskValid.createOrUpdate(dataNewTask);
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
        const existingCategories = yield Task_Category_1.Task_Category.findOne({
            where: {
                id: task_category
            },
        });
        if (!existingCategories)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task Category does not exist in the system',
            });
        for (let index = 0; index < employees.length; index++) {
            const employee_id = employees[index];
            const existingEmployee = yield Employee_1.Employee.findOne({
                where: {
                    id: employee_id,
                },
            });
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system',
                });
            //check role employee
            taskEmployees.push(existingEmployee);
        }
        //create taskfile
        const createdTask = yield Task_1.Task.create(Object.assign(Object.assign({}, dataNewTask), { employees: taskEmployees })).save();
        //create task files
        for (let index = 0; index < task_files.length; index++) {
            const task_file = task_files[index];
            yield Task_File_1.Task_file.create(Object.assign(Object.assign({}, task_file), { task: task_file })).save();
        }
        return res.status(200).json({
            code: 200,
            success: true,
            task: createdTask,
            message: ' Create new Task success'
        });
    })),
    //Update Task
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateTask = req.body;
        // const { task_category, project, employees} = dataUpdateTask
        const { employees } = dataUpdateTask;
        let taskEmployees = [];
        const existingtask = yield Task_1.Task.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        //check exist task category
        const existingtaskcategory = yield Task_1.Task.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtaskcategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task category does not exist in the system'
            });
        //check exist project
        const existingproject = yield Project_1.Project.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingproject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check valid input create new task
        //Check valid
        const messageValid = taskValid_1.taskValid.createOrUpdate(dataUpdateTask);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        for (let index = 0; index < employees.length; index++) {
            const employee_id = employees[index];
            const existingEmployee = yield Employee_1.Employee.findOne({
                where: {
                    id: employee_id,
                },
            });
            if (!existingEmployee)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employees does not exist in the system',
                });
            taskEmployees.push(existingEmployee);
        }
        //update task
        ;
        (existingtask.name = dataUpdateTask.name),
            (existingtask.project = dataUpdateTask.project),
            (existingtask.start_date = dataUpdateTask.start_date),
            (existingtask.deadline = dataUpdateTask.deadline),
            (existingtask.task_category = dataUpdateTask.task_category),
            existingtask.employees = taskEmployees;
        yield existingtask.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update Task success',
        });
    })),
    //Get all task
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tasks = yield Task_1.Task.find();
        return res.status(200).json({
            code: 200,
            success: true,
            projects: tasks,
            message: 'Get all projects success',
        });
    })),
    //Get detail task
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingtask = yield Task_1.Task.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            task: existingtask,
            message: 'Get detail of task success',
        });
    })),
    //Delete task
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingtask = yield Task_1.Task.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task does not exist in the system',
            });
        yield existingtask.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete task success',
        });
    })),
    deletemany: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { tasks } = req.body;
        //check array of tasks
        if (!Array.isArray(tasks) || !tasks)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        for (let index = 0; index < tasks.length; index++) {
            const itemtask = tasks[index];
            const existingtask = yield Task_1.Task.findOne({
                where: {
                    id: itemtask.id,
                },
            });
            if (existingtask) {
                yield existingtask.remove();
            }
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete tasks success',
        });
    })),
};
exports.default = taskController;
//     //Create new task
//     create: handleCatchError(async (req: Request, res: Response) =>{
//         const dataNewTask: createOrUpdateTaskPayload = req.body
//         const { task_category, project, employees, task_files} = dataNewTask
//         //check valid 
//         const messageValid = taskValid.createOrUpdate(dataNewTask)
//     })
// }
// export default taskController

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
const Task_1 = require("../entities/Task");
const Task_File_1 = require("../entities/Task_File");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const taskFileController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { files, task } = req.body;
        //check exist task
        const existingTask = yield Task_1.Task.findOne({
            where: {
                id: task,
            }
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This task does not exist in the system',
            });
        if (Array.isArray(files)) {
            files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield Task_File_1.Task_file.create(Object.assign(Object.assign({}, file), { task: existingTask })).save();
            }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new task files success'
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { taskFileId, taskId } = req.params;
        const existingTask = yield Task_1.Task.findOne({
            where: {
                id: Number(taskId),
            },
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This task does not existing in the system'
            });
        //check existing task file
        const existingTaskFile = yield Task_File_1.Task_file.findOne({
            where: {
                id: Number(taskFileId),
                task: {
                    id: Number(taskId),
                }
            }
        });
        if (!existingTaskFile)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'This task file does not existing in the system'
            });
        //delete task file 
        yield existingTaskFile.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete task file success'
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { taskId } = req.params;
        //Check existtask
        const existingtask = yield Task_1.Task.findOne({
            where: {
                id: Number(taskId),
            },
        });
        if (!existingtask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        //Get alltask file 
        const taskFiles = yield Task_File_1.Task_file.find({
            where: {
                task: {
                    id: Number(taskId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            taskFiles,
            message: 'Get all task files success successfully',
        });
    })),
    changeposition: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { status1, task1, status2, task2 } = req.body;
        console.log(status1);
        if (status1 == status2) {
            const existingtask = yield Task_1.Task.findOne({
                where: {
                    id: Number(task2),
                    status: {
                        id: status2
                    }
                }
            });
            if (!existingtask)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Either task does not exist in the system',
                });
            const alltask = yield Task_1.Task.createQueryBuilder('task').where('task.index >= :index', {
                index: existingtask.index
            }).getMany();
            if (alltask)
                yield Promise.all(alltask.map((task) => __awaiter(void 0, void 0, void 0, function* () {
                    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                        const result = Task_1.Task.update({
                            id: Number(task.id), status: {
                                id: status2
                            }
                        }, {
                            index: Number(task.index) + 1
                        });
                        resolve(result);
                    }));
                })));
            yield Task_1.Task.update({
                id: task1,
                status: {
                    id: status1
                }
            }, {
                index: Number(existingtask.index)
            });
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'change position of task success'
            });
        }
        return res.status(400).json({
            code: 400,
            success: false,
            message: 'Either task does not exist in the system',
        });
    }))
};
exports.default = taskFileController;

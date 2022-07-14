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
const Employee_1 = require("../entities/Employee");
const Project_1 = require("../entities/Project");
const Task_1 = require("../entities/Task");
const Task_Comment_1 = require("../entities/Task_Comment");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const taskCommentValid_1 = require("../utils/valid/taskCommentValid");
const taskCommentController = {
    //Create new discussion
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dataNewTaskComment = req.body;
        const { task, project } = dataNewTaskComment;
        //Check valid input
        const messageValid = taskCommentValid_1.taskCommentValid.createOrUpdate(dataNewTaskComment);
        if (messageValid)
            return res.status(400).json({
                code: 400,
                success: false,
                message: messageValid,
            });
        //Check existing task
        const existingTask = yield Task_1.Task.findOne({
            where: {
                id: task,
            },
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task does not exist in the system',
            });
        //check exists project
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
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
        const existingUser = yield Employee_1.Employee.findOne({
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
        if (!existingProject.employees.some((employeeItem) => employeeItem.email === existingUser.email) &&
            existingUser.role !== Employee_1.enumRole.ADMIN)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization',
            });
        //Create new task comment
        const createdTaskComment = yield Task_Comment_1.Task_comment.create({
            task: existingTask,
            content: dataNewTaskComment.content,
            employee: existingUser
        }).save();
        return res.status(200).json({
            code: 200,
            success: true,
            taskComment: createdTaskComment,
            message: 'Created new task comment successfully',
        });
    })),
    getByTask: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { taskId } = req.params;
        //Check exist task
        const existingTask = yield Task_1.Task.findOne({
            where: {
                id: Number(taskId),
            },
        });
        if (!existingTask)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task doest not exist in the system',
            });
        //Get all task comment
        const taskComments = yield Task_Comment_1.Task_comment.find({
            where: {
                task: { id: Number(taskId) },
            },
            relations: {
                employee: true
            },
            order: {
                createdAt: 'DESC',
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            taskComments,
            message: 'Get task comments by task successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { taskCommentId } = req.params;
        //Check exist task comment
        const existingTaskComment = yield Task_Comment_1.Task_comment.findOne({
            where: {
                id: Number(taskCommentId),
            },
            relations: {
                employee: true,
            },
        });
        if (!existingTaskComment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task comment doest not exist in the system',
            });
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
        const existingUser = yield Employee_1.Employee.findOne({
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
        if (existingTaskComment.employee.email !== existingUser.email &&
            existingUser.role !== Employee_1.enumRole.ADMIN)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization',
            });
        //Delete task comment
        yield existingTaskComment.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Deleted task comment successfully',
        });
    })),
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        const { taskCommentId } = req.params;
        const { content } = req.body;
        if (!content)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Please enter full field',
            });
        //Check exist task comment
        const existingTaskComment = yield Task_Comment_1.Task_comment.findOne({
            where: {
                id: Number(taskCommentId),
            },
            relations: {
                employee: true
            }
        });
        if (!existingTaskComment)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task comment doest not exist in the system',
            });
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
        const existingUser = yield Employee_1.Employee.findOne({
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
        if (existingTaskComment.employee.email !== existingUser.email &&
            existingUser.role !== Employee_1.enumRole.ADMIN)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You not have authorization',
            });
        //Update task comment
        existingTaskComment.content = content;
        yield existingTaskComment.save();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Updated discussion successfully',
        });
    })),
};
exports.default = taskCommentController;

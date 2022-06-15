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
const Task_Category_1 = require("../entities/Task_Category");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const taskCategoryController = {
    //Create new task category
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewCategory = req.body;
        const { name } = dataNewCategory;
        //Check existing name
        const existingName = yield Task_Category_1.Task_Category.findOne({
            where: {
                name: String(name),
            },
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Task category already exist in the system',
            });
        const createdtask_category = yield Task_Category_1.Task_Category.create(dataNewCategory).save();
        return res.status(200).json({
            code: 200,
            success: true,
            taskCategory: createdtask_category,
            message: 'Created new task_category successfully',
        });
    })),
    //Update task category
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdatetask_category = req.body;
        const { name } = dataUpdatetask_category;
        const existingtask_category = yield Task_Category_1.Task_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed task_category
        if (!existingtask_category)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task category does not exist in the system',
            });
        if (name !== existingtask_category.name) {
            const existingName = yield Task_Category_1.Task_Category.findOne({
                where: {
                    name: String(name),
                },
            });
            if (existingName)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'task_category already exist in the system',
                });
        }
        yield Task_Category_1.Task_Category.update(existingtask_category.id, Object.assign({}, dataUpdatetask_category));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update task category successfully',
        });
    })),
    //Get all task category
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const task_categories = yield Task_Category_1.Task_Category.find();
        return res.status(200).json({
            code: 200,
            success: true,
            taskCategories: task_categories,
            message: 'Get all task categories successfully',
        });
    })),
    //Get detail task category
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingtask_category = yield Task_Category_1.Task_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtask_category)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task_category does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            taskCategory: existingtask_category,
            message: 'Get detail of task_category successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingtask_category = yield Task_Category_1.Task_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingtask_category)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'task category does not exist in the system',
            });
        //Delete task category
        yield existingtask_category.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete task_category successfully',
        });
    })),
};
exports.default = taskCategoryController;

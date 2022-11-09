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
const Project_Discussion_Category_entity_1 = require("../entities/Project_Discussion_Category.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectDiscussionCategoryController = {
    //Create new project discussion category
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewCategory = req.body;
        const { name } = dataNewCategory;
        //Check existing name
        const existingName = yield Project_Discussion_Category_entity_1.Project_discussion_category.findOne({
            where: {
                name: String(name),
            },
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project discussion category already exist in the system',
            });
        const result = yield Project_Discussion_Category_entity_1.Project_discussion_category.create(dataNewCategory).save();
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionCategory: result,
            message: 'Created new project discussion category successfully',
        });
    })),
    //Update project category
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdate = req.body;
        const { name } = dataUpdate;
        const existingData = yield Project_Discussion_Category_entity_1.Project_discussion_category.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed project_category
        if (!existingData)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project category does not exist in the system',
            });
        if (name !== existingData.name) {
            const existingName = yield Project_Discussion_Category_entity_1.Project_discussion_category.findOne({
                where: {
                    name: String(name),
                },
            });
            if (existingName)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'project_category already exist in the system',
                });
        }
        yield Project_Discussion_Category_entity_1.Project_discussion_category.update(existingData.id, Object.assign({}, dataUpdate));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update project category successfully',
        });
    })),
    //Get all project category
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield Project_Discussion_Category_entity_1.Project_discussion_category.find();
        return res.status(200).json({
            code: 200,
            success: true,
            projectDiscussionCategories: data,
            message: 'Get all project discussion categories successfully',
        });
    })),
    //Get detail project discussion category
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingCategory = yield Project_Discussion_Category_entity_1.Project_discussion_category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'project discussion category does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            project_category: existingCategory,
            message: 'Get detail of project discussion category successfully',
        });
    })),
    //delete project discussion category
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingCategory = yield Project_Discussion_Category_entity_1.Project_discussion_category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project category does not exist in the system',
            });
        //Delete project discussion category
        yield existingCategory.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete project discussion category successfully',
        });
    })),
};
exports.default = projectDiscussionCategoryController;

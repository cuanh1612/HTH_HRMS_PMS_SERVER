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
const Project_Category_entity_1 = require("../entities/Project_Category.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectCategoryController = {
    //Create new project category
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const dataNewCategory = req.body;
        const { name } = dataNewCategory;
        //Check existing name
        const existingName = yield Project_Category_entity_1.Project_Category.findOne({
            where: {
                name: String(name),
            },
        });
        if (existingName)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project category already exist in the system',
            });
        const createdProjectCategory = yield Project_Category_entity_1.Project_Category.create(dataNewCategory).save();
        return res.status(200).json({
            code: 200,
            success: true,
            project_category: createdProjectCategory,
            message: 'Created new project_category successfully',
        });
    })),
    //Update project category
    update: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const dataUpdateProjectCategory = req.body;
        const { name } = dataUpdateProjectCategory;
        const existingProjectCategory = yield Project_Category_entity_1.Project_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        //check existed project_category
        if (!existingProjectCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project category does not exist in the system',
            });
        if (name !== existingProjectCategory.name) {
            const existingName = yield Project_Category_entity_1.Project_Category.findOne({
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
        yield Project_Category_entity_1.Project_Category.update(existingProjectCategory.id, Object.assign({}, dataUpdateProjectCategory));
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Update project category successfully',
        });
    })),
    //Get all project category
    getAll: (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
        const projectCategories = yield Project_Category_entity_1.Project_Category.find();
        return res.status(200).json({
            code: 200,
            success: true,
            projectCategories: projectCategories,
            message: 'Get all project categories successfully.',
        });
    })),
    //Get detail project category
    getDetail: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingProjectCategory = yield Project_Category_entity_1.Project_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingProjectCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'project_category does not exist in the system',
            });
        return res.status(200).json({
            code: 200,
            success: true,
            project_category: existingProjectCategory,
            message: 'Get detail of project_category successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const existingProjectCategory = yield Project_Category_entity_1.Project_Category.findOne({
            where: {
                id: Number(id),
            },
        });
        if (!existingProjectCategory)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project category does not exist in the system',
            });
        //Delete project category
        yield existingProjectCategory.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete project_category successfully',
        });
    })),
};
exports.default = projectCategoryController;

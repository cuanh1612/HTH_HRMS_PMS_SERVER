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
const Client_entity_1 = require("../entities/Client.entity");
const Employee_entity_1 = require("../entities/Employee.entity");
const Project_entity_1 = require("../entities/Project.entity");
const Project_File_entity_1 = require("../entities/Project_File.entity");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectFileController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { files, project, assignBy } = req.body;
        //Check exist Project
        const existingProject = yield Project_entity_1.Project.findOne({
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
        //Check exist assign by
        if (assignBy) {
            const existingAssignBy = yield Employee_entity_1.Employee.findOne({
                where: {
                    id: assignBy,
                },
            });
            if (!existingAssignBy)
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Employee assign not exist in the system',
                });
        }
        //Create new project file
        if (Array.isArray(files)) {
            files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield Project_File_entity_1.Project_file.create(Object.assign(Object.assign(Object.assign({}, (assignBy ? { assignBy: assignBy } : {})), file), { project: existingProject })).save();
            }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new Project files success successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { projectFileId, projectId } = req.params;
        //Get existing project to check auth if current user have role project admin
        const existingProject = yield Project_entity_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
            relations: {
                project_Admin: true,
            },
            select: {
                project_Admin: {
                    email: true,
                },
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Project does not exist in the system',
            });
        //Check auth current user
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({
                code: 400,
                success: false,
                message: 'Please login first',
            });
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
        //Get data user
        const existingUser = (yield Employee_entity_1.Employee.findOne({
            where: {
                email: decode.email,
            },
        })) ||
            (yield Client_entity_1.Client.findOne({
                where: {
                    email: decode.email,
                },
            }));
        if (!existingUser)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'User does not exist in the system',
            });
        if (existingUser.role !== Employee_entity_1.enumRole.ADMIN &&
            existingUser.email !== existingProject.project_Admin.email)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'You do not have permission to perform this feature',
            });
        //Check exist Project file
        const existingProjectFile = yield Project_File_entity_1.Project_file.findOne({
            where: {
                id: Number(projectFileId),
                project: {
                    id: Number(projectId),
                },
            },
        });
        if (!existingProjectFile)
            return res.status(400).json({
                code: 400,
                success: false,
                message: `Project file does not exist in the system`,
            });
        //Delete project file
        yield existingProjectFile.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete Project file success successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        //Check exist Project
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
        //Get all project file
        const projectFiles = yield Project_File_entity_1.Project_file.find({
            where: {
                project: {
                    id: Number(projectId),
                },
            },
            order: {
                createdAt: 'DESC',
            },
            relations: {
                assignBy: true,
            },
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projectFiles,
            message: 'Get all project files success successfully',
        });
    })),
};
exports.default = projectFileController;

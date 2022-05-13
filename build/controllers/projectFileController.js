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
const Project_1 = require("../entities/Project");
const Project_File_1 = require("../entities/Project_File");
const catchAsyncError_1 = __importDefault(require("../utils/catchAsyncError"));
const projectFileController = {
    create: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { files, project } = req.body;
        //Check exist Project
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: project,
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Create new project file
        if (Array.isArray(files)) {
            files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
                yield Project_File_1.Project_file.create(Object.assign(Object.assign({}, file), { project: existingProject })).save();
            }));
        }
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Create new contract files success successfully',
        });
    })),
    delete: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectFileId, projectId } = req.params;
        //auth Header here is "Bearer accessToken"
        const authHeader = req.header('Authorization');
        const accessToken = authHeader && authHeader.split(' ')[1];
        if (!accessToken)
            return res.status(401).json({
                code: 401,
                success: false,
                message: 'Not authenticated to perform operations',
            });
        //Check exist project
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Check exist Project file
        const existingProjectFile = yield Project_File_1.Project_file.findOne({
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
                message: `Contract file does not exist in the system ${projectFileId} ${projectId}`,
            });
        //Delete project file
        yield existingProjectFile.remove();
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Delete contract file success successfully',
        });
    })),
    getAll: (0, catchAsyncError_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { projectId } = req.params;
        //Check exist Project
        const existingProject = yield Project_1.Project.findOne({
            where: {
                id: Number(projectId),
            },
        });
        if (!existingProject)
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Contract does not exist in the system',
            });
        //Get all project file 
        const projectFiles = yield Project_File_1.Project_file.find({
            where: {
                project: {
                    id: Number(projectId)
                }
            },
            order: {
                createdAt: "DESC"
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            projectFiles,
            message: 'Get all contract files success successfully',
        });
    })),
};
exports.default = projectFileController;
